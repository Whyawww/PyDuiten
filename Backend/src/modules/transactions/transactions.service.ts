import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from '../auth/dto/create-transaction.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    let category = await this.prisma.category.findFirst({
      where: {
        name: dto.categoryName,
        userId: userId,
        type: dto.type,
      },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: dto.categoryName,
          type: dto.type,
          userId: userId,
        },
      });
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        description: dto.description || '',
        categoryId: category.id,
        userId: userId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        category: {
          select: { name: true },
        },
      },
    });

    return {
      status: 'success',
      message: 'Transaksi berhasil dicatat, cuy!',
      data: transaction,
    };
  }

  async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const aggregations = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    aggregations.forEach((agg) => {
      const sumAmount = agg._sum.amount ? Number(agg._sum.amount) : 0;

      if (agg.type === 'INCOME') {
        totalIncome = sumAmount;
      } else if (agg.type === 'EXPENSE') {
        totalExpense = sumAmount;
      }
    });

    const balance = totalIncome - totalExpense;

    const aiAdvice = await this.aiService.generateFinancialAdvice(
      totalIncome,
      totalExpense,
    );

    return {
      status: 'success',
      data: {
        totalIncome,
        totalExpense,
        balance,
        aiAdvice,
      },
    };
  }
}

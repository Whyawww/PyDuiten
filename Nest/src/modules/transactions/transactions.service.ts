import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from '../auth/dto/create-transaction.dto';
import { AiService } from '../ai/ai.service';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    let categoryId: string | undefined = undefined;

    if (dto.categoryName) {
      let category = await this.prisma.category.findFirst({
        where: { name: dto.categoryName, userId: userId, type: dto.type },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: { name: dto.categoryName, type: dto.type, userId: userId },
        });
      }
      categoryId = category.id;
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        description: dto.description || '',
        categoryId: categoryId,
        userId: userId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        date: true,
        category: { select: { name: true } },
      },
    });

    return {
      status: 'success',
      message: 'Transaksi berhasil dicatat, cuy!',
      data: transaction,
    };
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!existing) throw new NotFoundException('Transaksi nggak ketemu, cuy!');

    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: dto.amount,
        type: dto.type,
        description: dto.description,
      },
    });
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!existing) throw new NotFoundException('Transaksi nggak ketemu, cuy!');

    return this.prisma.transaction.delete({
      where: { id: transactionId },
    });
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

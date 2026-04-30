import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from '../auth/dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

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
}

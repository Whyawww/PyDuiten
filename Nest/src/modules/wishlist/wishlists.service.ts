import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateWishlistDto,
  UpdateWishlistDto,
  ReorderWishlistDto,
} from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWishlistDto) {
    const lastItem = await this.prisma.wishlist.findFirst({
      where: { userId },
      orderBy: { priority: 'desc' },
    });
    const newPriority = lastItem ? lastItem.priority + 1 : 0;

    return this.prisma.wishlist.create({
      data: {
        ...dto,
        priority: newPriority,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: { priority: 'asc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateWishlistDto) {
    return this.prisma.wishlist.update({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.wishlist.delete({
      where: { id, userId },
    });
  }

  async reorder(userId: string, dto: ReorderWishlistDto) {
    const transactions = dto.items.map((item) =>
      this.prisma.wishlist.update({
        where: { id: item.id, userId },
        data: { priority: item.priority },
      }),
    );
    await this.prisma.$transaction(transactions);
    return { status: 'success', message: 'Reordered successfully' };
  }
}

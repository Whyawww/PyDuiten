import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    photoPath?: string,
  ) {
    try {
      if (dto.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });
        if (existingEmail && existingEmail.id !== userId) {
          throw new ConflictException('Email sudah dipakai orang lain, cuy.');
        }
      }

      const updateData: Prisma.UserUpdateInput = {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      };

      if (dto.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(dto.password, salt);
      }

      if (photoPath) {
        updateData.photo = photoPath;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { id: true, email: true, name: true, phone: true, photo: true },
      });

      return {
        status: 'success',
        message: 'Profil berhasil diperbarui.',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Gagal update profil, server lagi bermasalah.',
      );
    }
  }
}

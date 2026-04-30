import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah, cuy.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah, cuy.');
    }
    const payload = { sub: user.id };
    return {
      status: 'success',
      message: 'Login berhasil',
      data: {
        accessToken: await this.jwtService.signAsync(payload),
      },
    };
  }

  async register(data: RegisterDto) {
    if (
      await this.prisma.user.findUnique({
        where: { email: data.email },
      })
    ) {
      throw new BadRequestException('Email sudah digunakan, bro.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}

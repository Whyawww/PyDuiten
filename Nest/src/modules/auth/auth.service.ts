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
import { randomBytes } from 'crypto';
import { MailService } from '../../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          photo: user.photo,
        },
      },
    };
  }

  async register(data: RegisterDto) {
    if (
      await this.prisma.user.findUnique({
        where: { email: data.email },
      })
    ) {
      throw new BadRequestException('Email udah digunakan, cuy.');
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      return { message: 'Jika email terdaftar, instruksi akan dikirim.' };

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExp: expiry },
    });

    await this.mailService.sendResetPassword(dto.email, token);
    return { message: 'Instruksi reset password sudah dikirim ke email lu.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExp: { gt: new Date() },
      },
    });

    if (!user)
      throw new BadRequestException(
        'Token tidak valid atau sudah expired cuy.',
      );

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return {
      status: 'success',
      message: 'Sandi baru lu udah aktif, silakan login.',
    };
  }
}

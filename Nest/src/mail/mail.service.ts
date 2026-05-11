import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendResetPassword(email: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"PyDuiten Team" <no-reply@pyduiten.com>',
      to: email,
      subject: 'Reset Kata Sandi PyDuiten Lu',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #3d2b1f;">
          <h2 style="color: #e07a5f;">Halo Cuy!</h2>
          <p>Ada permintaan buat reset kata sandi di akun PyDuiten lu.</p>
          <p>Klik tombol di bawah ini buat bikin sandi baru (berlaku 1 jam):</p>
          <div style="margin: 30px 0;">
            <a href="${url}" style="background: #e07a5f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 12px; font-weight: bold;">Reset Sandi Sekarang</a>
          </div>
          <p style="font-size: 12px; color: #9c7b6a;">Kalau lu nggak ngerasa minta reset, cuekin aja email ini cuy.</p>
        </div>
      `,
    });
  }
}

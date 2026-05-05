import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './modules/ai/ai.service';
import { AiModule } from './modules/ai/ai.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiService, AuthService],
})
export class AppModule {}

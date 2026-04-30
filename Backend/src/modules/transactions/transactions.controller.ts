import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../auth/dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../common/get-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @GetUser('id') userId: string,
  ) {
    return this.transactionsService.createTransaction(userId, dto);
  }

  @Get('summary')
  async getSummary(@GetUser('id') userId: string) {
    return this.transactionsService.getSummary(userId);
  }
}

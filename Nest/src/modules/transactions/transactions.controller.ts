import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  TransactionsService,
  UpdateTransactionDto,
} from './transactions.service';
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

  @Get()
  async findAll(@GetUser('id') userId: string) {
    return this.transactionsService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @GetUser('id') userId: string,
  ) {
    return this.transactionsService.updateTransaction(userId, id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.transactionsService.deleteTransaction(userId, id);
  }
}

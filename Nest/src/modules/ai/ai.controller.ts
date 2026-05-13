import {
  Controller,
  Get,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(ThrottlerGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Get('advice')
  async getAdvice(
    @Query('income') income: string,
    @Query('expense') expense: string,
  ) {
    const inc = Number(income);
    const exp = Number(expense);

    if (isNaN(inc) || isNaN(exp)) {
      throw new HttpException(
        'Income dan Expense wajib berupa angka yang valid cuy!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const advice = await this.aiService.generateFinancialAdvice(inc, exp);

    return {
      status: 'success',
      data: { advice },
    };
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get('smart-nudge')
  async getSmartNudge(
    @Query('income') income: string,
    @Query('expense') expense: string,
  ) {
    const inc = Number(income);
    const exp = Number(expense);

    if (isNaN(inc) || isNaN(exp)) {
      throw new HttpException(
        'Format angka tidak valid cuy!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const nudge = await this.aiService.generateSmartNudge(inc, exp);

    return {
      status: 'success',
      data: { nudge },
    };
  }
}

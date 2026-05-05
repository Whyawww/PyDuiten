import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { TransactionType } from '@prisma/client';

export { TransactionType };

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'Nominal harus berupa angka' })
  @IsPositive({ message: 'Nominal harus lebih dari 0' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType, { message: 'Tipe harus INCOME atau EXPENSE' })
  type: TransactionType;

  @IsString()
  @IsOptional()
  categoryName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

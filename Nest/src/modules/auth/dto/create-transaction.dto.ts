import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'Nominal harus berupa angka' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType, { message: 'Tipe harus INCOME atau EXPENSE' })
  type: TransactionType;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;
}

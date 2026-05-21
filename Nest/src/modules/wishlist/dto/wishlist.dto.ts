import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsNumber()
  budget: number;
}

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsBoolean()
  isAchieved?: boolean;
}

class ReorderItem {
  @IsString()
  id: string;

  @IsNumber()
  priority: number;
}

export class ReorderWishlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items: ReorderItem[];
}

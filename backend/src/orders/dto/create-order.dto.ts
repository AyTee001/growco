import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  deliverySlotId?: number;

  @IsString()
  @IsNotEmpty()
  deliveryTimeRange: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  // @IsDateString(), for dates like "2024-05-20"
  @IsString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isPaperless?: boolean;

  @IsArray()
  @IsOptional()
  items?: any[];
}
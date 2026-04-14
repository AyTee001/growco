import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_PATTERNS } from 'src/shared/validation.constants';

export enum PaymentMethod {
  CASH_ON_PICKUP = 'cash_on_pickup'
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsInt()
  deliverySlotId?: number;

  @IsString()
  @IsNotEmpty()
  deliveryTimeRange: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Ім\'я має містити мінімум 2 символи' })
  @Matches(VALIDATION_PATTERNS.NAME, { 
    message: 'Ім\'я може містити лише літери' 
  })
  customerName?: string;

  @IsOptional()
  @IsString()
  @Matches(VALIDATION_PATTERNS.PHONE_UA, { 
    message: 'Телефон має бути у форматі: +380XXXXXXXXX' 
  })
  customerPhone?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isPaperless?: boolean;
}

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
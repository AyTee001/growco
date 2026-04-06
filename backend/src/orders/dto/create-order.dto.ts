import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliveryAddressId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId?: number | null;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliverySlotId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  status: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  paymentMethod: string;
}
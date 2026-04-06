import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : value,
  )
  description?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  qtyInStock: number;

  @IsOptional()
  @IsUrl()
  @IsString()
  imgUrl?: string | null;
}
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
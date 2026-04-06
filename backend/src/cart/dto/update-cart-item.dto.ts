import { IsInt, IsPositive, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
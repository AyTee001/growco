import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ 
    type: 'integer', 
    example: 1, 
    description: 'The ID of the product to add' 
  })
  @IsInt()
  productId: number;

  @ApiProperty({ 
    type: 'integer', 
    example: 1, 
    default: 1, 
    description: 'Quantity of the product' 
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}
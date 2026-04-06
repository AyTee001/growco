import { ApiProperty } from '@nestjs/swagger';

export class FilterOptionsDto {
  @ApiProperty()
  minPrice: number;

  @ApiProperty()
  maxPrice: number;

  @ApiProperty()
  brands: string[];
}
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Products } from '../entities/Products';
import { Query } from '@nestjs/common';
import { ProductsQueryDto } from './dto/products-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category with filters and sorting' })
  @ApiOkResponse({ type: [Products] })
  findAllByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() query: ProductsQueryDto
  ) {
    return this.productsService.findAllByCategory(categoryId, query);
  }

  @Get()
  @ApiOkResponse({ type: [Products] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Products })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
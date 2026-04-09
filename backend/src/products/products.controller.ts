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
import { FilterOptionsDto } from './dto/filter-options.dto';
import { FilterQueryDto } from './dto/filter-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Find products with optional category, search, and filters' })
  @ApiOkResponse({ type: [Products] })
  findAll(@Query() query: ProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('filter-options')
  @ApiOperation({ summary: 'Get dynamic filter options based on search or category' })
  @ApiOkResponse({ type: FilterOptionsDto })
  findAllOptions(@Query() query: FilterQueryDto) {
    return this.productsService.getFilterOptions(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Products })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get up to 15 similar products based on category' })
  @ApiOkResponse({ type: [Products] })
  findSimilar(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findSimilar(id);
  }
}
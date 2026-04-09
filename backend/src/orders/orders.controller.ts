import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create order (works for both guests and logged users)',
  })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // Якщо JWT Guard спрацював, беремо ID з токена
    const userId = req.user?.userId;
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get history for current user' })
  findMyOrders(@Request() req) {
    if (!req.user) throw new UnauthorizedException();
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create order (works for both guests and logged users) and clears cart',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const authenticatedUserId = req.user?.userId;

    const sessionId = req.cookies?.['guest_cart_id'];

    const order = await this.ordersService.create(
      createOrderDto,
      authenticatedUserId,
      sessionId,
    );

    if (sessionId) {
      res.clearCookie('guest_cart_id', { path: '/' });
    }

    return order;
  }

  @Get('my')
  @ApiOperation({ summary: 'Get history for current user' })
  findMyOrders(@Request() req) {
    if (!req.user) throw new UnauthorizedException('Please log in to view order history');
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
import { 
  Controller, Get, Post, Body, 
  Request, Res, UseGuards} from '@nestjs/common';
import express from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { Orders } from 'src/entities/Orders';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create order. Uses token data for users, DTO for guests.' })
  @ApiOkResponse({ type: Orders })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const userId = req.user?.userId;
    const sessionId = req.cookies?.['guest_cart_id'];

    const order = await this.ordersService.create(
      createOrderDto,
      userId,
      sessionId,
    );

    if (sessionId) {
      res.clearCookie('guest_cart_id', { path: '/' });
    }

    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Get order history for the authenticated user' })
  @ApiOkResponse({ type: [Orders] })
  findMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }
}
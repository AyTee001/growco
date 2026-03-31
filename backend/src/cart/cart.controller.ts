import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Res, Req } from '@nestjs/common';
import express from 'express';
import { Cart } from 'src/entities/Cart';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  async create(@Body() createDto: CreateCartDto) {
    return this.cartService.create(createDto);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user cart based on session cookie' })
  @ApiOkResponse({ type: Cart })
  async getCurrent(@Req() request: express.Request) {
    const sessionId = request.cookies['guest_cart_id'];

    if (!sessionId) {
      return { cartItems: [] };
    }

    return this.cartService.findOrCreateBySession(sessionId);
  }

  @Post('add-item')
  @ApiOperation({ summary: 'Add item to cart; initializes session if missing' })
  @ApiOkResponse({ type: Cart })
  async addToCart(
    @Body() body: AddToCartDto,
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response, // Required to set cookies
  ) {
    let sessionId = request.cookies['guest_cart_id'];

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      response.cookie('guest_cart_id', sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return this.cartService.addItem(sessionId, body.productId, body.quantity);
  }
  @Delete('item/:itemId')
  @ApiOperation({ summary: 'Remove specific item from cart' })
  @ApiOkResponse({ type: Cart })
  async removeItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() request: express.Request
  ) {
    const sessionId = request.cookies['guest_cart_id'];
    if (!sessionId) return { cartItems: [] };

    return this.cartService.removeCartItem(sessionId, itemId);
  }
}

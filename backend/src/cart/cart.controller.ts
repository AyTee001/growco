import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, Req, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from 'src/entities/Cart';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { Request, Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get('current')
  @ApiOperation({ summary: 'Get current cart (guest or user)' })
  @ApiOkResponse({ type: Cart })
  async getCurrent(@Req() req: Request, @CurrentUser() user?: any) {
    if (user) {
      // Авторизованный пользователь
      return this.cartService.findOrCreateByUserId(user.userId);
    }
    const sessionId = req.cookies['guest_cart_id'];
    if (!sessionId) return { cartItems: [] };
    return this.cartService.findOrCreateBySession(sessionId);
  }

  @Post('add-item')
  @ApiOperation({ summary: 'Add item to cart (guest or user)' })
  @ApiOkResponse({ type: Cart })
  async addToCart(
    @Body() body: AddToCartDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user?: any,
  ) {
    if (user) {
      // Авторизованный пользователь
      const cart = await this.cartService.findOrCreateByUserId(user.userId);
      return this.cartService.updateItemQuantityByCartId(cart.cartId, body.productId, body.quantity);
    }

    let sessionId = req.cookies['guest_cart_id'];
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      res.cookie('guest_cart_id', sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: '/',
      });
    }
    return this.cartService.updateItemQuantity(sessionId, body.productId, body.quantity);
  }

  @Delete('item/:itemId')
  async removeItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req: Request,
    @CurrentUser() user?: any,
  ) {
    if (user) {
      const cart = await this.cartService.findOrCreateByUserId(user.userId);
      await this.cartService.removeCartItemByCartId(cart.cartId, itemId);
      return this.cartService.findOne(cart.cartId);
    }
    const sessionId = req.cookies['guest_cart_id'];
    if (!sessionId) return { cartItems: [] };
    return this.cartService.removeCartItem(sessionId, itemId);
  }

  @Delete('clear')
  async clear(@Req() req: Request, @CurrentUser() user?: any) {
    if (user) {
      const cart = await this.cartService.findOrCreateByUserId(user.userId);
      return this.cartService.clearCartByCartId(cart.cartId);
    }
    const sessionId = req.cookies['guest_cart_id'];
    if (!sessionId) return { cartItems: [] };
    return this.cartService.clearCart(sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Merge guest cart with user cart after login' })
  async mergeGuestCart(
    @CurrentUser() user: any,
    @Body('guestSessionId') guestSessionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Если передан guestSessionId, используем его для слияния
    if (guestSessionId) {
      const mergedCart = await this.cartService.mergeGuestCart(user.userId, guestSessionId);
      // Очищаем cookie гостя
      res.clearCookie('guest_cart_id');
      return mergedCart;
    }
    // Если нет guestSessionId, просто возвращаем корзину пользователя
    return this.cartService.findOrCreateByUserId(user.userId);
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItemsController } from './cart-items.controller'; // Новий контролер
import { CartItemsService } from './cart-items.service'; // Новий сервіс
import { Cart } from '../entities/Cart';
import { Users } from '../entities/Users';
import { CartItems } from '../entities/CartItems';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Users, CartItems]),],
  controllers: [CartController, CartItemsController,],
  providers: [CartService, CartItemsService,],
  exports: [CartService, CartItemsService,],
})
export class CartModule {}
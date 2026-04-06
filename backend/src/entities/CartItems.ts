import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { Products } from './Products';
import { ApiProperty } from '@nestjs/swagger';

@Index('IX_CartItems_Cart_Id', ['cartId'], {})
@Index('CartItems_pkey', ['itemId'], { unique: true })
@Index('IX_CartItems_Product_Id', ['productId'], {})
@Entity('CartItems', { schema: 'public' })
export class CartItems {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'item_id' })
  itemId: number;

  @ApiProperty({ type: 'integer' })
  @Column('integer', { name: 'cart id' })
  cartId: number;

  @ApiProperty({ type: 'integer' })
  @Column('integer', { name: 'product id' })
  productId: number;

  @ApiProperty({ type: 'integer', default: 1 })
  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @ApiProperty({ type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'cart id', referencedColumnName: 'cartId' }])
  cart: Cart;

  @ApiProperty({ type: () => Products })
  @ManyToOne(() => Products, (products) => products.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'product id', referencedColumnName: 'productId' }])
  product: Products;
}

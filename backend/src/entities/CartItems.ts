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

@Index('IX_CartItems_Cart_Id', ['cartId'], {})
@Index('CartItems_pkey', ['itemId'], { unique: true })
@Index('IX_CartItems_Product_Id', ['productId'], {})
@Entity('CartItems', { schema: 'public' })
export class CartItems {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'item_id' })
  itemId: number;

  @Column('integer', { name: 'cart id' })
  cartId: number;

  @Column('integer', { name: 'product id' })
  productId: number;

  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'cart id', referencedColumnName: 'cartId' }])
  cart: Cart;

  @ManyToOne(() => Products, (products) => products.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'product id', referencedColumnName: 'productId' }])
  product: Products;
}

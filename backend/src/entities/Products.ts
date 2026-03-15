import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItems } from './CartItems';
import { OrderItems } from './OrderItems';
import { Categories } from './Categories';

@Index('ix_products_name', ['name'], {})
@Index('products_pkey', ['productId'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @Column('integer', { name: 'qty_in_stock', default: () => '0' })
  qtyInStock: number;

  @Column('character varying', { name: 'img_url', nullable: true, length: 500 })
  imgUrl: string | null;

  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];
}

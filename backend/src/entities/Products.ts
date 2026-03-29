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
import { ApiProperty } from '@nestjs/swagger';

@Index('ix_products_name', ['name'], {})
@Index('products_pkey', ['productId'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_id' })
  productId: number;

  @ApiProperty({ type: 'string' })
  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ApiProperty({ type: 'string', description: 'Current product price' })
  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @ApiProperty({ type: 'integer', default: 0 })
  @Column('integer', { name: 'qty_in_stock', default: () => '0' })
  qtyInStock: number;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('character varying', { name: 'img_url', nullable: true, length: 500 })
  imgUrl: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: 'Pepsi' })
  @Column('character varying', { nullable: true, length: 100 })
  brand: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: 'Україна' })
  @Column('character varying', { name: 'origin_country', nullable: true, length: 100 })
  originCountry: string | null;

  @ApiProperty({ type: 'boolean', default: false })
  @Column('boolean', { name: 'is_promo', default: false })
  isPromo: boolean;

  @ApiProperty({ 
    type: 'string', 
    nullable: true, 
    required: false, 
    description: 'Price before discount' 
  })
  @Column('numeric', { name: 'old_price', precision: 10, scale: 2, nullable: true })
  oldPrice: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: '1.75' })
  @Column('numeric', { name: 'net_content', precision: 10, scale: 2, nullable: true })
  netContent: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: 'л' })
  @Column('character varying', { nullable: true, length: 20 })
  unit: string | null;

  @ApiProperty({ type: () => [CartItems] })
  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @ApiProperty({ type: () => [OrderItems] })
  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @ApiProperty({ type: () => [Categories] })
  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];
}
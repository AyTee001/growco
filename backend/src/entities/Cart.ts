import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { CartItems } from './CartItems';

@Index('Cart_pkey', ['cartId'], { unique: true })
@Index('Cart_guest_session_id_key', ['guestSessionId'], { unique: true })
@Index('IX_Cart_User_Id', ['userId'], {})
@Entity('Cart', { schema: 'public' })
export class Cart {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cart_id' })
  cartId: number;

  @Column('integer', { name: 'user id', nullable: true })
  userId: number | null;

  @Column('character varying', {
    name: 'guest_session_id',
    nullable: true,
    unique: true,
    length: 255,
  })
  guestSessionId: string | null;

  @ManyToOne(() => Users, (users) => users.carts, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user id', referencedColumnName: 'userId' }])
  user: Users;

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart)
  cartItems: CartItems[];
}

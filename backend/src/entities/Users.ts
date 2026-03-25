import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { LoyaltyTransactions } from './LoyaltyTransactions';
import { Orders } from './Orders';
import { Addresses } from './Addresses';

@Index('unique_email', ['email'], { unique: true })
@Index('users_email_key', ['email'], { unique: true })
@Index('users_phone_number_key', ['phoneNumber'], { unique: true })
@Index('unique_phone', ['phoneNumber'], { unique: true })
@Index('users_pkey', ['userId'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column('character varying', { name: 'phone_number', length: 20 })
  phoneNumber: string;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('character varying', { name: 'password_hash', length: 255 })
  passwordHash: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(
    () => LoyaltyTransactions,
    (loyaltyTransactions) => loyaltyTransactions.user,
  )
  loyaltyTransactions: LoyaltyTransactions[];

  @OneToMany(() => Orders, (orders) => orders.user)
  orders: Orders[];

  @OneToMany(() => Addresses, (addresses) => addresses.user)
  addresses: Addresses[];
}

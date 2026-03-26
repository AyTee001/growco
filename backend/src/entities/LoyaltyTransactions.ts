import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';
import { Users } from './Users';

@Index('IX_Loyalty_Order_Id', ['orderId'], {})
@Index('LoyaltyTransactions_pkey', ['transactionId'], { unique: true })
@Index('IX_Loyalty_User_Id', ['userId'], {})
@Entity('LoyaltyTransactions', { schema: 'public' })
export class LoyaltyTransactions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'transaction_id' })
  transactionId: number;

  @Column('integer', { name: 'user id' })
  userId: number;

  @Column('integer', { name: 'order id', nullable: true })
  orderId: number | null;

  @Column('timestamp without time zone', {
    name: 'transaction date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionDate: Date;

  @Column('integer', { name: 'amount' })
  amount: number;

  @Column('character varying', { name: 'reason', length: 255 })
  reason: string;

  @ManyToOne(() => Orders, (orders) => orders.loyaltyTransactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'order id', referencedColumnName: 'orderId' }])
  order: Orders;

  @ManyToOne(() => Users, (users) => users.loyaltyTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user id', referencedColumnName: 'userId' }])
  user: Users;
}

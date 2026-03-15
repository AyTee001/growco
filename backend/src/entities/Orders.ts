import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoyaltyTransactions } from './LoyaltyTransactions';
import { OrderItems } from './OrderItems';
import { DeliverySlots } from './DeliverySlots';
import { Stores } from './Stores';
import { Users } from './Users';

@Index('IX_Orders_Address_Id', ['deliveryAddressId'], {})
@Index('IX_Orders_Slot_Id', ['deliverySlotId'], {})
@Index('Orders_pkey', ['orderId'], { unique: true })
@Index('IX_Orders_Store_Id', ['storeId'], {})
@Index('IX_Orders_User_Id', ['userId'], {})
@Entity('Orders', { schema: 'public' })
export class Orders {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'order_id' })
  orderId: number;

  @Column('integer', { name: 'user id' })
  userId: number;

  @Column('integer', { name: 'delivery address id', nullable: true })
  deliveryAddressId: number | null;

  @Column('integer', { name: 'store id', nullable: true })
  storeId: number | null;

  @Column('integer', { name: 'delivery slot id' })
  deliverySlotId: number;

  @Column('timestamp without time zone', {
    name: 'order date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @Column('numeric', { name: 'total amount', precision: 10, scale: 2 })
  totalAmount: string;

  @Column('character varying', { name: 'payment method', length: 50 })
  paymentMethod: string;

  @OneToMany(
    () => LoyaltyTransactions,
    (loyaltyTransactions) => loyaltyTransactions.order,
  )
  loyaltyTransactions: LoyaltyTransactions[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @ManyToOne(() => DeliverySlots, (deliverySlots) => deliverySlots.orders)
  @JoinColumn([{ name: 'delivery slot id', referencedColumnName: 'slotId' }])
  deliverySlot: DeliverySlots;

  @ManyToOne(() => Stores, (stores) => stores.orders)
  @JoinColumn([{ name: 'store id', referencedColumnName: 'storeId' }])
  store: Stores;

  @ManyToOne(() => Users, (users) => users.orders)
  @JoinColumn([{ name: 'user id', referencedColumnName: 'userId' }])
  user: Users;
}

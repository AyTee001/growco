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

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('integer', { name: 'delivery_slot_id', nullable: true })
  deliverySlotId: number | null;

  @Column('timestamp without time zone', {
    name: 'order_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @Column('numeric', { name: 'total_amount', precision: 10, scale: 2 })
  totalAmount: string;

  @Column('character varying', { name: 'payment_method', length: 50 })
  paymentMethod: string;

  @Column('character varying', {
    name: 'delivery_address',
    nullable: true,
    length: 500,
  })
  deliveryAddress: string | null;

  @Column('date', { name: 'delivery_date', nullable: true })
  deliveryDate: string | Date | null;

  @Column('character varying', {
    name: 'customer_name',
    nullable: true,
    length: 255,
  })
  customerName: string | null;

  @Column('character varying', {
    name: 'customer_phone',
    nullable: true,
    length: 50,
  })
  customerPhone: string | null;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('boolean', { name: 'is_paperless', default: false })
  isPaperless: boolean;

  @Column('time without time zone', {
    name: 'delivery_slot_start',
    nullable: true,
  })
  deliverySlotStart: string | null;

  @Column('time without time zone', {
    name: 'delivery_slot_end',
    nullable: true,
  })
  deliverySlotEnd: string | null;

  @Column('integer', { name: 'delivery_address_id', nullable: true })
  deliveryAddressId: number | null;

  @Column('integer', { name: 'store_id', nullable: true })
  storeId: number | null;

  @OneToMany(
    () => LoyaltyTransactions,
    (loyaltyTransactions) => loyaltyTransactions.order,
  )
  loyaltyTransactions: LoyaltyTransactions[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @ManyToOne(() => DeliverySlots, (deliverySlots) => deliverySlots.orders)
  @JoinColumn([{ name: 'delivery_slot_id', referencedColumnName: 'slotId' }]) // Виправлено на snake_case
  deliverySlot: DeliverySlots;

  @ManyToOne(() => Stores, (stores) => stores.orders)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'storeId' }]) // Виправлено на snake_case
  store: Stores;

  @ManyToOne(() => Users, (users) => users.orders)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }]) // Виправлено на snake_case
  user: Users;
}

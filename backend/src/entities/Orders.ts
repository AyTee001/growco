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

// Індекси також мають посилатися на правильні назви властивостей класу
@Index('IX_Orders_Address_Id', ['deliveryAddressId'], {})
@Index('IX_Orders_Slot_Id', ['deliverySlotId'], {})
@Index('Orders_pkey', ['orderId'], { unique: true })
@Index('IX_Orders_Store_Id', ['storeId'], {})
@Index('IX_Orders_User_Id', ['userId'], {})
@Entity('Orders', { schema: 'public' })
export class Orders {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'order_id' })
  orderId: number;

  // Назва в БД: "user id"
  @Column('integer', { name: 'user id', nullable: true })
  userId: number | null;

  // Назва в БД: "delivery slot id"
  @Column('integer', { name: 'delivery slot id', nullable: true })
  deliverySlotId: number | null;

  // Назва в БД: "order date"
  @Column('timestamp without time zone', {
    name: 'order date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  // Назва в БД: "total amount"
  @Column('numeric', { name: 'total amount', precision: 10, scale: 2 })
  totalAmount: string;

  // Назва в БД: "payment method"
  @Column('character varying', { name: 'payment method', length: 50 })
  paymentMethod: string;

  // Назва в БД: "delivery address id"
  @Column('integer', { name: 'delivery address id', nullable: true })
  deliveryAddressId: number | null;

  // Назва в БД: "store id"
  @Column('integer', { name: 'store id', nullable: true })
  storeId: number | null;

  // Решта полів, які ми додавали пізніше (customer_name тощо)
  // Якщо їх немає в CREATE TABLE, вони мають бути nullable в Entity
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

  @Column('character varying', {
    name: 'delivery_address',
    nullable: true,
    length: 500,
  })
  deliveryAddress: string | null;

  @Column('date', { name: 'delivery_date', nullable: true })
  deliveryDate: string | Date | null;

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

  // --- Relations ---

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

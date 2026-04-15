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
import { ApiProperty } from '@nestjs/swagger';
import { ColumnNumericTransformer } from '../shared/column-numeric-transformer';

@Index('IX_Orders_Address_Id', ['deliveryAddressId'], {})
@Index('IX_Orders_Slot_Id', ['deliverySlotId'], {})
@Index('Orders_pkey', ['orderId'], { unique: true })
@Index('IX_Orders_Store_Id', ['storeId'], {})
@Index('IX_Orders_User_Id', ['userId'], {})
@Entity('Orders', { schema: 'public' })
export class Orders {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'order_id' })
  orderId: number;

  @ApiProperty({ type: 'integer', nullable: true })
  @Column('integer', { name: 'user id', nullable: true })
  userId: number | null;

  @ApiProperty({ type: 'integer', nullable: true })
  @Column('integer', { name: 'delivery slot id', nullable: true })
  deliverySlotId: number | null;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @Column('timestamp without time zone', {
    name: 'order date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @ApiProperty({ type: 'string', example: 'PENDING' })
  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @ApiProperty({ type: 'number', description: 'Total order cost' })
  @Column('numeric', { 
    name: 'total amount', 
    precision: 10, 
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  totalAmount: number;

  @ApiProperty({ type: 'string', example: 'cash_on_pickup' })
  @Column('character varying', { name: 'payment method', length: 50 })
  paymentMethod: string;

  @ApiProperty({ type: 'integer', nullable: true, required: false })
  @Column('integer', { name: 'delivery address id', nullable: true })
  deliveryAddressId: number | null;

  @ApiProperty({ type: 'integer', nullable: true, required: false })
  @Column('integer', { name: 'store id', nullable: true })
  storeId: number | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('character varying', {
    name: 'customer_name',
    nullable: true,
    length: 255,
  })
  customerName: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('character varying', {
    name: 'customer_phone',
    nullable: true,
    length: 50,
  })
  customerPhone: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('character varying', {
    name: 'delivery_address',
    nullable: true,
    length: 500,
  })
  deliveryAddress: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('date', { name: 'delivery_date', nullable: true })
  deliveryDate: string | Date | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @ApiProperty({ type: 'boolean', default: false })
  @Column('boolean', { name: 'is_paperless', default: false })
  isPaperless: boolean;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: '10:00' })
  @Column('time without time zone', {
    name: 'delivery_slot_start',
    nullable: true,
  })
  deliverySlotStart: string | null;

  @ApiProperty({ type: 'string', nullable: true, required: false, example: '12:00' })
  @Column('time without time zone', {
    name: 'delivery_slot_end',
    nullable: true,
  })
  deliverySlotEnd: string | null;

  // --- Relations ---

  @ApiProperty({ type: () => [LoyaltyTransactions], required: false })
  @OneToMany(
    () => LoyaltyTransactions,
    (loyaltyTransactions) => loyaltyTransactions.order,
  )
  loyaltyTransactions: LoyaltyTransactions[];

  @ApiProperty({ type: () => [OrderItems], required: false })
  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @ApiProperty({ type: () => DeliverySlots, required: false })
  @ManyToOne(() => DeliverySlots, (deliverySlots) => deliverySlots.orders)
  @JoinColumn([{ name: 'delivery slot id', referencedColumnName: 'slotId' }])
  deliverySlot: DeliverySlots;

  @ApiProperty({ type: () => Stores, required: false })
  @ManyToOne(() => Stores, (stores) => stores.orders)
  @JoinColumn([{ name: 'store id', referencedColumnName: 'storeId' }])
  store: Stores;

  @ApiProperty({ type: () => Users, required: false })
  @ManyToOne(() => Users, (users) => users.orders)
  @JoinColumn([{ name: 'user id', referencedColumnName: 'userId' }])
  user: Users;
}

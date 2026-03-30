import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Orders } from '../entities/Orders';
import { Users } from '../entities/Users';
import { Stores } from '../entities/Stores';
import { DeliverySlots } from '../entities/DeliverySlots';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    @InjectRepository(Stores) private readonly storesRepo: Repository<Stores>,
    @InjectRepository(DeliverySlots)
    private readonly slotsRepo: Repository<DeliverySlots>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Orders> {
    // 1. Бізнес-валідація існування сутностей
    await this.validateRelations(dto);

    try {
      const order = this.ordersRepo.create({
        ...dto,
        totalAmount: dto.totalAmount.toString(), // Конвертація для numeric column
        orderDate: new Date(),
      });
      return await this.ordersRepo.save(order);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Database error during order creation: ' + error.message,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Orders[]> {
    return await this.ordersRepo.find({
      order: { orderId: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Orders> {
    const order = await this.ordersRepo.findOne({
      where: { orderId: id },
      relations: ['user', 'store', 'deliverySlot', 'orderItems'],
    });

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Orders> {
    const order = await this.findOne(id);

    // Якщо передані нові ID зв'язків — перевіряємо їх
    await this.validateRelations(dto);

    const updatedData = { ...dto };
    if (dto.totalAmount !== undefined) {
      (updatedData as any).totalAmount = dto.totalAmount.toString();
    }

    Object.assign(order, updatedData);
    return await this.ordersRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.ordersRepo.findOne({
      where: { orderId: id },
      relations: ['orderItems', 'loyaltyTransactions'],
    });

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    if (
      order.orderItems?.length > 0 ||
      (order as any).loyaltyTransactions?.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete order that has related items or loyalty transactions',
      );
    }

    await this.ordersRepo.remove(order);
  }

  private async validateRelations(dto: Partial<CreateOrderDto>) {
    if (
      dto.userId &&
      !(await this.usersRepo.findOneBy({ userId: dto.userId }))
    ) {
      throw new BadRequestException(
        `User with ID ${dto.userId} does not exist`,
      );
    }
    if (
      dto.deliverySlotId &&
      !(await this.slotsRepo.findOneBy({ slotId: dto.deliverySlotId }))
    ) {
      throw new BadRequestException(
        `DeliverySlot with ID ${dto.deliverySlotId} does not exist`,
      );
    }
    if (
      dto.storeId &&
      !(await this.storesRepo.findOneBy({ storeId: dto.storeId }))
    ) {
      throw new BadRequestException(
        `Store with ID ${dto.storeId} does not exist`,
      );
    }
  }
}
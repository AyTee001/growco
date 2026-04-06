import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Orders } from '../entities/Orders';
import { Users } from '../entities/Users';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Orders> {
    const user = await this.usersRepo.findOneBy({ userId: dto.userId });
    if (!user) throw new BadRequestException('User not found');

    try {
      const order = this.ordersRepo.create({
        ...dto,
        totalAmount: dto.totalAmount.toString(),
        orderDate: new Date(),
      });
      return await this.ordersRepo.save(order);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Database error: ' + error.message);
      }
      throw error;
    }
  }

  async findByUser(userId: number): Promise<Orders[]> {
    return await this.ordersRepo.find({
      where: { userId },
      order: { orderId: 'DESC' }, // Нові замовлення зверху
    });
  }

  async findOne(id: number): Promise<Orders> {
    const order = await this.ordersRepo.findOne({
      where: { orderId: id },
      relations: ['orderItems'], // Додано тільки orderItems
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Orders> {
    const order = await this.findOne(id);

    const updatedData = { ...dto };
    if (dto.totalAmount !== undefined) {
      (updatedData as any).totalAmount = dto.totalAmount.toString();
    }

    Object.assign(order, updatedData);
    return await this.ordersRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    if (order.orderItems && order.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete order that has related items',
      );
    }

    await this.ordersRepo.remove(order);
  }
}
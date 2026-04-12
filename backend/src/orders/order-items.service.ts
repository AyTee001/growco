import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItems } from '../entities/OrderItems';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItems)
    private readonly orderItemsRepo: Repository<OrderItems>,
  ) {}

  async findByOrder(orderId: number): Promise<OrderItems[]> {
    return await this.orderItemsRepo.find({
      where: { orderId },
      relations: ['product'],
    });
  }

  async findOne(itemId: number): Promise<OrderItems> {
    const item = await this.orderItemsRepo.findOne({
      where: { itemId },
      relations: ['product'],
    });
    if (!item) throw new NotFoundException(`Order item #${itemId} not found`);
    return item;
  }
}
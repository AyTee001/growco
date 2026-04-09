import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Orders } from '../entities/Orders';
import { OrderItems } from '../entities/OrderItems';
import { Users } from '../entities/Users';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateOrderDto,
    authenticatedUserId?: number,
  ): Promise<Orders> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let finalName = dto.customerName;
      let finalPhone = dto.customerPhone;
      const targetUserId = authenticatedUserId || dto.userId || null;

      // User auth check
      if (targetUserId) {
        const user = await queryRunner.manager.findOne(Users, {
          where: { userId: targetUserId },
        });
        if (user) {
          finalName = user.name || finalName;
          finalPhone = (user as any).phone || finalPhone;
        }
      }

      // Time slot parsing
      const timeParts = dto.deliveryTimeRange
        ? dto.deliveryTimeRange.split(/[-–—]/).map((t) => t.trim())
        : [];
      const startTime = timeParts[0] || null;
      const endTime = timeParts[1] || null;

      const order = queryRunner.manager.create(Orders, {
        ...dto,
        userId: targetUserId,
        customerName: finalName,
        customerPhone: finalPhone,
        totalAmount: dto.totalAmount.toString(),
        orderDate: new Date(),
        deliverySlotStart: startTime,
        deliverySlotEnd: endTime,
        deliverySlotId: dto.deliverySlotId || null,
      });

      const savedOrder = await queryRunner.manager.save(order);

      if (dto.items && dto.items.length > 0) {
        const orderItems = dto.items.map((item) =>
          queryRunner.manager.create(OrderItems, {
            orderId: savedOrder.orderId,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtOrder.toString(),
          }),
        );
        await queryRunner.manager.save(OrderItems, orderItems);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.orderId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Order creation failed: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findByUser(userId: number): Promise<Orders[]> {
    return await this.ordersRepo.find({
      where: { userId },
      order: { orderId: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Orders> {
    const order = await this.ordersRepo.findOne({
      where: { orderId: id },
      relations: ['orderItems', 'orderItems.product'],
    });

    // Якщо мок поверне null, спрацює ця помилка, а не "Cannot read properties of undefined"
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }
}
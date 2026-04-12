import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Orders } from '../entities/Orders';
import { OrderItems } from '../entities/OrderItems';
import { Users } from '../entities/Users';
import { Products } from '../entities/Products';
import { Cart } from '../entities/Cart'; 
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateOrderDto,
    authenticatedUserId?: number,
    sessionId?: string,
  ): Promise<Orders> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. SECURITY: Identity Check
      const targetUserId = authenticatedUserId || null;
      let finalName = dto.customerName;
      let finalPhone = dto.customerPhone;

      if (targetUserId) {
        const user = await queryRunner.manager.findOne(Users, {
          where: { userId: targetUserId },
        });
        if (user) {
          finalName = user.name || finalName;
          finalPhone = user.phoneNumber || finalPhone; 
        }
      }

      // 2. FETCH PRODUCTS
      const productIds = dto.items.map((i) => i.productId);
      const products = await queryRunner.manager.find(Products, {
        where: { productId: In(productIds) },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products in the order do not exist.');
      }

      // 3. STOCK & PRICE VALIDATION
      let calculatedTotal = 0;
      const verifiedOrderItems: { productId: number, quantity: number, priceAtPurchase: string }[] = [];
      const productsToUpdate: Products[] = [];

      for (const item of dto.items) {
        const product = products.find((p) => p.productId === item.productId);

        if (!product) {
          throw new BadRequestException(`Product with ID ${item.productId} could not be processed.`);
        }

        if (product.qtyInStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}. Available: ${product.qtyInStock}`,
          );
        }

        product.qtyInStock -= item.quantity;
        productsToUpdate.push(product);

        const itemPrice = product.price; 
        calculatedTotal += itemPrice * item.quantity;

        verifiedOrderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: itemPrice.toString(), 
        });
      }

      // 4. PARSE TIME SLOTS
      const timeParts = dto.deliveryTimeRange
        ? dto.deliveryTimeRange.split(/[-–—]/).map((t) => t.trim())
        : [];

      // 5. CREATE ORDER RECORD
      const order = queryRunner.manager.create(Orders, {
        ...dto,
        userId: targetUserId,
        customerName: finalName,
        customerPhone: finalPhone,
        totalAmount: calculatedTotal.toFixed(2),
        status: 'PENDING',
        paymentMethod: dto.paymentMethod || 'cash_on_pickup',
        orderDate: new Date(),
        deliverySlotStart: timeParts[0] || null,
        deliverySlotEnd: timeParts[1] || null,
        deliverySlotId: dto.deliverySlotId || null,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // 6. SAVE ITEMS & UPDATE INVENTORY
      const orderItemEntities = verifiedOrderItems.map((item) =>
        queryRunner.manager.create(OrderItems, {
          ...item,
          orderId: savedOrder.orderId,
        }),
      );
      await queryRunner.manager.save(OrderItems, orderItemEntities);
      await queryRunner.manager.save(Products, productsToUpdate);

      // 7. CLEAR THE DATABASE CART
      if (targetUserId) {
        await queryRunner.manager.delete(Cart, { user: { userId: targetUserId } });
      } else if (sessionId) {
        await queryRunner.manager.delete(Cart, { guestSessionId: sessionId });
      }

      // 8. COMMIT
      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.orderId);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Order creation failed: ' + (err as any).message);
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

    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }
}
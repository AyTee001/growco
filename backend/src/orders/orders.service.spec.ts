import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders } from '../entities/Orders';
import { Users } from '../entities/Users';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepo: any;

  const mockOrderInstance = {
    orderId: 1,
    customerName: 'Guest User',
    totalAmount: '500.50',
  };

  const mockQueryRunner = {
    connect: jest.fn().mockResolvedValue(null),
    startTransaction: jest.fn().mockResolvedValue(null),
    commitTransaction: jest.fn().mockResolvedValue(null),
    rollbackTransaction: jest.fn().mockResolvedValue(null),
    release: jest.fn().mockResolvedValue(null),
    manager: {
      create: jest.fn().mockReturnValue(mockOrderInstance),
      save: jest.fn().mockResolvedValue(mockOrderInstance),
      findOne: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Orders),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockOrderInstance), // Для this.findOne в кінці
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: { findOneBy: jest.fn() },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepo = module.get(getRepositoryToken(Orders));
  });

  describe('create', () => {
    const createDto: any = {
      deliveryTimeRange: '10:00 - 12:00',
      totalAmount: 500.5,
      paymentMethod: 'Card',
      customerName: 'Guest User',
      items: [{ productId: 1, quantity: 1, priceAtOrder: 500.5 }],
    };

    it('should successfully create a guest order', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null); // Користувача не знайдено (гість)

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.orderId).toBe(1);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should use user data if authenticatedUserId is provided', async () => {
      const mockUser = { userId: 10, name: 'John Doe', phone: '987654321' };
      mockQueryRunner.manager.findOne.mockResolvedValue(mockUser);

      ordersRepo.findOne.mockResolvedValueOnce({
        ...mockOrderInstance,
        customerName: 'John Doe',
      });

      const result = await service.create(createDto, 10);

      expect(result.customerName).toBe('John Doe');
      expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ customerName: 'John Doe' }),
      );
    });

    it('should rollback transaction on error', async () => {
      mockQueryRunner.manager.save.mockRejectedValueOnce(
        new Error('Transaction failed'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
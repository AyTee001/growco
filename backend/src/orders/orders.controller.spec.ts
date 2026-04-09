import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UnauthorizedException } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('should pass userId from token if available', async () => {
      const dto = { totalAmount: 100 } as any;
      const req = { user: { userId: 5 } };

      await controller.create(dto, req);

      expect(service.create).toHaveBeenCalledWith(dto, 5);
    });

    it('should work without userId (guest mode)', async () => {
      const dto = { totalAmount: 100 } as any;
      const req = { user: null }; // Неавторизований

      await controller.create(dto, req);

      expect(service.create).toHaveBeenCalledWith(dto, undefined);
    });
  });

  describe('findMyOrders', () => {
    it('should throw UnauthorizedException if req.user is missing', () => {
      const req = { user: null };
      expect(() => controller.findMyOrders(req)).toThrow(UnauthorizedException);
    });

    it('should return orders for logged user', async () => {
      const req = { user: { userId: 5 } };
      mockOrdersService.findByUser.mockResolvedValue([]);

      const result = await controller.findMyOrders(req);
      expect(result).toEqual([]);
      expect(service.findByUser).toHaveBeenCalledWith(5);
    });
  });
});
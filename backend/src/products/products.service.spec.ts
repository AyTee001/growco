import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from '../entities/Products';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Products>;

  const mockProduct = {
    productId: 1,
    name: 'Test Product',
    price: '100.00',
    cartItems: [],
    orderItems: [],
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    find: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Products>>(getRepositoryToken(Products));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if product is used in cartItems', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockProduct,
        cartItems: [{ itemId: 1 }], // Товар не порожній у кошику
      });

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should call repo.remove if product is not used anywhere', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockProduct,
        cartItems: [],
        orderItems: [],
      });

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalled();
    });
  });
});
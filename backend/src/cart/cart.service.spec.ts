import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '../entities/Cart';
import { CartItems } from '../entities/CartItems';
import { Users } from '../entities/Users';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  const cartRepositoryMock = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const usersRepositoryMock = {
    findOne: jest.fn(),
  };

  const cartItemsRepositoryMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: cartRepositoryMock,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepositoryMock,
        },
        {
          provide: getRepositoryToken(CartItems),
          useValue: cartItemsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create cart with userId', async () => {
    usersRepositoryMock.findOne.mockResolvedValue({ userId: 1 });
    cartRepositoryMock.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    cartRepositoryMock.create.mockReturnValue({
      userId: 1,
      guestSessionId: null,
    });
    cartRepositoryMock.save.mockResolvedValue({
      cartId: 1,
      userId: 1,
      guestSessionId: null,
    });

    const result = await service.create({ userId: 1 });

    expect(result.cartId).toBe(1);
  });

  it('should create cart with guestSessionId', async () => {
    cartRepositoryMock.findOne.mockResolvedValue(null);
    cartRepositoryMock.create.mockReturnValue({
      userId: null,
      guestSessionId: 'guest-1',
    });
    cartRepositoryMock.save.mockResolvedValue({
      cartId: 2,
      userId: null,
      guestSessionId: 'guest-1',
    });

    const result = await service.create({ guestSessionId: 'guest-1' });

    expect(result.cartId).toBe(2);
  });

  it('should throw when both userId and guestSessionId are passed', async () => {
    await expect(
      service.create({ userId: 1, guestSessionId: 'guest-1' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when neither userId nor guestSessionId are passed', async () => {
    await expect(service.create({})).rejects.toThrow(BadRequestException);
  });

  it('should throw when user does not exist', async () => {
    usersRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.create({ userId: 999 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw conflict for duplicate guestSessionId', async () => {
    cartRepositoryMock.findOne.mockResolvedValue({
      cartId: 10,
      guestSessionId: 'guest-1',
    });

    await expect(service.create({ guestSessionId: 'guest-1' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('should return all carts', async () => {
    cartRepositoryMock.find.mockResolvedValue([{ cartId: 1 }]);

    const result = await service.findAll();

    expect(result).toEqual([{ cartId: 1 }]);
  });

  it('should return one cart', async () => {
    cartRepositoryMock.findOne.mockResolvedValue({
      cartId: 1,
      cartItems: [],
    });

    const result = await service.findOne(1);

    expect(result.cartId).toBe(1);
  });

  it('should throw 404 when cart not found', async () => {
    cartRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne(111)).rejects.toThrow(NotFoundException);
  });

  it('should update cart', async () => {
    cartRepositoryMock.findOne.mockImplementation(({ where }) => {
      if (where?.cartId === 1) {
        return Promise.resolve({
          cartId: 1,
          userId: null,
          guestSessionId: 'guest-1',
        });
      }

      if (where?.userId === 2) {
        return Promise.resolve(null);
      }

      if (where?.guestSessionId === 'guest-1') {
        return Promise.resolve({
          cartId: 1,
          userId: null,
          guestSessionId: 'guest-1',
        });
      }

      return Promise.resolve(null);
    });

    usersRepositoryMock.findOne.mockResolvedValue({ userId: 2 });
    cartRepositoryMock.save.mockResolvedValue({
      cartId: 1,
      userId: 2,
      guestSessionId: null,
    });

    const result = await service.update(1, { userId: 2, guestSessionId: null });

    expect(result.userId).toBe(2);
    expect(result.guestSessionId).toBeNull();
  });

  it('should delete empty cart', async () => {
    cartRepositoryMock.findOne.mockResolvedValue({
      cartId: 1,
      cartItems: [],
    });
    cartRepositoryMock.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);

    expect(result.message).toContain('deleted successfully');
  });

  it('should prevent deleting non-empty cart', async () => {
    cartRepositoryMock.findOne.mockResolvedValue({
      cartId: 1,
      cartItems: [{ itemId: 1 }],
    });

    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });
});

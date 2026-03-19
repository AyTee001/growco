import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

const mockUsersRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'test@example.com ',
        phoneNumber: ' 1234567890',
        name: ' Test User ',
        passwordHash: 'hashedpassword',
      };
      const user = { userId: 1, ...createUserDto, email: 'test@example.com', phoneNumber: '1234567890', name: 'Test User' };

      repository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        phoneNumber: '1234567890',
        name: 'Test User',
        passwordHash: 'hashedpassword',
      });
    });

    it('should throw ConflictException if email exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        phoneNumber: '1234567890',
        name: 'Test',
        passwordHash: 'pass',
      };
      repository.findOne.mockResolvedValueOnce({ userId: 1 });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { userId: 1, email: 'test@test.com' };
      repository.findOne.mockResolvedValue(user);

      expect(await service.findOne(1)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if user has relations', async () => {
      const userWithRelations = {
        userId: 1,
        carts: [{}],
        orders: [],
        addresses: [],
        loyaltyTransactions: [],
        loyaltyTransactions2: [],
      };
      repository.findOne.mockResolvedValue(userWithRelations);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should delete user if no relations', async () => {
      const user = {
        userId: 1,
        carts: [],
        orders: [],
        addresses: [],
        loyaltyTransactions: [],
        loyaltyTransactions2: [],
      };
      repository.findOne.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'User with id 1 deleted successfully' });
      expect(repository.remove).toHaveBeenCalledWith(user);
    });
  });
});

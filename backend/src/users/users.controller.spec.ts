import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      service.findAll.mockResolvedValue([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const user = { userId: 1, email: 'test@test.com' };
      service.findOne.mockResolvedValue(user);
      const result = await controller.findOne(1);
      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { email: 'a@a.com', phoneNumber: '123', name: 'Name', passwordHash: 'hash' };
      service.create.mockResolvedValue({ userId: 1, ...dto });
      const result = await controller.create(dto);
      expect(result.userId).toBe(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      service.remove.mockResolvedValue({ message: 'User with id 1 deleted successfully' });
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'User with id 1 deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

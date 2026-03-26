import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeliverySlots } from '../entities/DeliverySlots';
import { Orders } from '../entities/Orders';
import { DeliverySlotsService } from './delivery-slots.service';

describe('DeliverySlotsService', () => {
  let service: DeliverySlotsService;

  const deliverySlotsRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const ordersRepositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverySlotsService,
        {
          provide: getRepositoryToken(DeliverySlots),
          useValue: deliverySlotsRepositoryMock,
        },
        {
          provide: getRepositoryToken(Orders),
          useValue: ordersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DeliverySlotsService>(DeliverySlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

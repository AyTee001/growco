import { Test, TestingModule } from '@nestjs/testing';
import { DeliverySlotsController } from './delivery-slots.controller';
import { DeliverySlotsService } from './delivery-slots.service';

describe('DeliverySlotsController', () => {
  let controller: DeliverySlotsController;

  const deliverySlotsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverySlotsController],
      providers: [
        {
          provide: DeliverySlotsService,
          useValue: deliverySlotsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DeliverySlotsController>(DeliverySlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

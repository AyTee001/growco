import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn((dto) => ({ productId: 1, ...dto })),
    findAll: jest.fn(() => []),
    findOne: jest.fn((id) => ({ productId: id, name: 'Test' })),
    update: jest.fn((id, dto) => ({ productId: id, ...dto })),
    remove: jest.fn(() => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with ParseIntPipe value', async () => {
    const id = 10;
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });
});
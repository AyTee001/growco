import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './сategories.controller';
import { CategoriesService } from './сategories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllTree: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: categoriesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

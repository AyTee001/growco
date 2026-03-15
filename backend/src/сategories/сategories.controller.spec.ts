import { Test, TestingModule } from '@nestjs/testing';
import { СategoriesController } from './сategories.controller';
import { СategoriesService } from './сategories.service';

describe('СategoriesController', () => {
  let controller: СategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [СategoriesController],
      providers: [СategoriesService],
    }).compile();

    controller = module.get<СategoriesController>(СategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

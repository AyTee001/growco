import { Test, TestingModule } from '@nestjs/testing';
import { СategoriesService } from './сategories.service';

describe('СategoriesService', () => {
  let service: СategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [СategoriesService],
    }).compile();

    service = module.get<СategoriesService>(СategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Stores } from '../entities/Stores';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Stores)
    private readonly storesRepository: Repository<Stores>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const existingStore = await this.storesRepository.findOne({
      where: {
        city: createStoreDto.city.trim(),
        street: createStoreDto.street.trim(),
        houseNumber: createStoreDto.houseNumber.trim(),
      },
    });

    if (existingStore) {
      throw new ConflictException(
        `Магазин за адресою ${createStoreDto.city}, ${createStoreDto.street} ${createStoreDto.houseNumber} вже існує`,
      );
    }

    const store = this.storesRepository.create({
      name: createStoreDto.name.trim(),
      city: createStoreDto.city.trim(),
      street: createStoreDto.street.trim(),
      houseNumber: createStoreDto.houseNumber.trim(),
      workingHours: createStoreDto.workingHours.trim(),
    });

    try {
      return await this.storesRepository.save(store);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Помилка при створенні магазину');
      }
      throw error;
    }
  }

  async findAll() {
    return this.storesRepository.find({
      order: { storeId: 'ASC' },
    });
  }

  async findOne(storeId: number) {
    const store = await this.storesRepository.findOne({
      where: { storeId },
    });

    if (!store) {
      throw new NotFoundException(`Магазин з ID ${storeId} не знайдено`);
    }

    return store;
  }

  async update(storeId: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.findOne(storeId);

    Object.assign(store, updateStoreDto);

    try {
      return await this.storesRepository.save(store);
    } catch {
      throw new BadRequestException('Помилка при оновленні магазину');
    }
  }

  async remove(storeId: number) {
    const store = await this.storesRepository.findOne({
      where: { storeId },
      relations: ['orders'],
    });

    if (!store) {
      throw new NotFoundException(`Магазин з ID ${storeId} не знайдено`);
    }

    // Захист від видалення, якщо є замовлення
    if (store.orders && store.orders.length > 0) {
      throw new BadRequestException(
        `Не можна видалити магазин, оскільки до нього вже прив'язано ${store.orders.length} замовлень.`,
      );
    }

    await this.storesRepository.delete(storeId);

    return {
      message: `Магазин з ID ${storeId} успішно видалено`,
    };
  }
}

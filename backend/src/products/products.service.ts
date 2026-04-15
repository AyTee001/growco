import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../entities/Products';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { FilterOptionsDto } from './dto/filter-options.dto';
import { FilterQueryDto } from './dto/filter-query.dto';
import { WeeklyProductGeneratorService } from './weekly-generator.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly weeklyGenerator: WeeklyProductGeneratorService,
  ) { }

  async findAll(queryDto: ProductsQueryDto): Promise<Products[]> {
    const {
      categoryId,
      search,
      brands,
      minPrice,
      maxPrice,
      isPromo,
      weekOnly,
      sort,
    } = queryDto;
    
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category');

    if (weekOnly) {
      const weeklyIds = this.weeklyGenerator.getWeeklyIds();
      if (weeklyIds && weeklyIds.length > 0) {
        query.andWhere('product.productId IN (:...weeklyIds)', { weeklyIds });
      } else {
        return [];
      }
    }

    if (categoryId && categoryId !== 0) {
      query.where('category.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      query.andWhere('product.name ilike :search', { search: `%${search}%` });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (brands && brands.length > 0) {
      query.andWhere('product.brand IN (:...brands)', { brands });
    }

    if (isPromo) {
      query.andWhere('product.isPromo = :isPromo', { isPromo: true });
    }

    switch (sort) {
      case 'price_desc':
        query.orderBy('product.price', 'DESC');
        break;
      case 'name_asc':
        query.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
        query.orderBy('product.name', 'DESC');
        break;
      case 'promo':
        query.orderBy('product.isPromo', 'DESC').addOrderBy('product.price', 'ASC');
        break;
      case 'price_asc':
      default:
        query.orderBy('product.price', 'ASC');
        break;
    }

    return await query.getMany();
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const product = this.productsRepository.create({
      ...createProductDto,
      price: createProductDto.price,
    });
    return await this.productsRepository.save(product);
  }

  async findOne(id: number): Promise<Products> {
    const product = await this.productsRepository.findOne({
      where: { productId: id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.findOne(id);

    const updatedData = { ...updateProductDto };
    if (updateProductDto.price !== undefined) {
      (updatedData as any).price = updateProductDto.price.toString();
    }

    Object.assign(product, updatedData);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { productId: id },
      relations: ['cartItems', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.cartItems.length > 0 || product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product that is used in cart items or order items',
      );
    }

    await this.productsRepository.remove(product);
  }

  async getFilterOptions(queryDto: FilterQueryDto): Promise<FilterOptionsDto> {
    const { categoryId, search } = queryDto;

    // Create the base "Scope" (Where are we looking?)
    const baseQuery = this.productsRepository.createQueryBuilder('product')
      .leftJoin('product.categories', 'category');

    if (categoryId) {
      baseQuery.andWhere('category.categoryId = :categoryId', { categoryId });
    }
    if (search) {
      baseQuery.andWhere('product.name ilike :search', { search: `%${search}%` });
    }

    const stats = await baseQuery.clone()
      .select('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .getRawOne();

    const brands = await baseQuery.clone()
      .select('DISTINCT(product.brand)', 'brand')
      .andWhere('product.brand IS NOT NULL')
      .orderBy('brand', 'ASC')
      .getRawMany();

    return {
      minPrice: parseFloat(stats?.min || '0'),
      maxPrice: parseFloat(stats?.max || '1000'),
      brands: brands.map(b => b.brand),
    };
  }

  async findSimilar(id: number): Promise<Products[]> {
    const product = await this.findOne(id);
    const categoryIds = product.categories.map((cat) => cat.categoryId);

    if (categoryIds.length === 0) return [];

    return await this.productsRepository.createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.categoryId IN (:...categoryIds)', { categoryIds })
      .andWhere('product.productId != :id', { id })
      .groupBy('product.productId')
      .orderBy('RANDOM()')
      .limit(15)
      .getMany();
  }

  async findWeeklyDeals(): Promise<Products[]> {
    // 1. Отримуємо ID, які згенерував WeeklyProductGeneratorService
    const weeklyIds = this.weeklyGenerator.getWeeklyIds();

    if (!weeklyIds || weeklyIds.length === 0) {
      return [];
    }

    // 2. Повертаємо продукти за цими ID
    // Використовуємо findBy для простоти або QueryBuilder для сортування
    return await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.productId IN (:...ids)', { ids: weeklyIds })
      .getMany();
  }
}
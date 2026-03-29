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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) { }

  async findAllByCategory(categoryId: number, queryDto: ProductsQueryDto): Promise<Products[]> {
    const { sort, minPrice, maxPrice, brands, isPromo } = queryDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('category.categoryId = :categoryId', { categoryId });

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
      price: createProductDto.price.toString(),
    });
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Products[]> {
    return await this.productsRepository.find({
      order: { productId: 'ASC' },
    });
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

  async getFilterOptions(categoryId: number): Promise<FilterOptionsDto> {
    const priceResult = await this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .select('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .where('category.categoryId = :categoryId', { categoryId })
      .getRawOne();

    const brandResult = await this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .select('DISTINCT(product.brand)', 'brand')
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('product.brand IS NOT NULL')
      .orderBy('brand', 'ASC')
      .getRawMany();

    return {
      minPrice: parseFloat(priceResult?.min || '0'),
      maxPrice: parseFloat(priceResult?.max || '1000'),
      brands: brandResult.map(res => res.brand),
    };
  }
}
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) { }

  async findAllByCategory(categoryId: number, sort: string): Promise<Products[]> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('category.categoryId = :categoryId', { categoryId });

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
}
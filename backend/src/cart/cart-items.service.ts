import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CartItems } from '../entities/CartItems';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
  ) {}

  async create(dto: CreateCartItemDto): Promise<CartItems> {
    try {
      const newItem = this.cartItemsRepository.create(dto);
      return await this.cartItemsRepository.save(newItem);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Invalid Cart ID or Product ID');
      }
      throw error;
    }
  }

  async findAll(): Promise<CartItems[]> {
    return await this.cartItemsRepository.find({
      relations: ['product'],
      order: { itemId: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CartItems> {
    const item = await this.cartItemsRepository.findOne({
      where: { itemId: id },
      relations: ['product', 'cart'],
    });
    if (!item) throw new NotFoundException(`CartItem with ID ${id} not found`);
    return item;
  }

  async update(id: number, dto: UpdateCartItemDto): Promise<CartItems> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return await this.cartItemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.cartItemsRepository.remove(item);
  }
}
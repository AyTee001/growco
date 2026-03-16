import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Cart } from '../entities/Cart';
import { CartItems } from '../entities/CartItems';
import { Users } from '../entities/Users';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
  ) {}

  private normalizeGuestSessionId(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      throw new BadRequestException('guestSessionId cannot be empty');
    }

    return trimmed;
  }

  private validateAssociation(
    userId?: number | null,
    guestSessionId?: string | null,
  ) {
    const hasUserId = userId !== undefined && userId !== null;
    const hasGuestSessionId =
      guestSessionId !== undefined && guestSessionId !== null;

    if (!hasUserId && !hasGuestSessionId) {
      throw new BadRequestException(
        'Cart must be associated with either userId or guestSessionId',
      );
    }

    if (hasUserId && hasGuestSessionId) {
      throw new BadRequestException(
        'Cart cannot be associated with both userId and guestSessionId',
      );
    }
  }

  private async ensureUserExists(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  private async ensureGuestSessionIdUnique(
    guestSessionId: string,
    excludeCartId?: number,
  ) {
    const existingCart = await this.cartRepository.findOne({
      where: { guestSessionId },
    });

    if (existingCart && existingCart.cartId !== excludeCartId) {
      throw new ConflictException(
        `Cart with guestSessionId "${guestSessionId}" already exists`,
      );
    }
  }

  private async ensureUserCartUnique(userId: number, excludeCartId?: number) {
    const existingCart = await this.cartRepository.findOne({
      where: { userId },
    });

    if (existingCart && existingCart.cartId !== excludeCartId) {
      throw new ConflictException(
        `Cart for user with id ${userId} already exists`,
      );
    }
  }

  async create(createCartDto: CreateCartDto) {
    const guestSessionId = this.normalizeGuestSessionId(
      createCartDto.guestSessionId,
    );

    this.validateAssociation(createCartDto.userId, guestSessionId);

    if (createCartDto.userId !== undefined && createCartDto.userId !== null) {
      await this.ensureUserExists(createCartDto.userId);
      await this.ensureUserCartUnique(createCartDto.userId);
    }

    if (guestSessionId !== null) {
      await this.ensureGuestSessionIdUnique(guestSessionId);
    }

    const cart = this.cartRepository.create({
      userId: createCartDto.userId ?? null,
      guestSessionId,
    });

    try {
      return await this.cartRepository.save(cart);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Failed to create cart');
      }

      throw error;
    }
  }

  async findAll() {
    return this.cartRepository.find({
      relations: ['user', 'cartItems'],
      order: { cartId: 'ASC' },
    });
  }

  async findOne(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { cartId },
      relations: ['user', 'cartItems'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    return cart;
  }

  async update(cartId: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    const nextUserId =
      updateCartDto.userId !== undefined ? updateCartDto.userId : cart.userId;

    const nextGuestSessionId =
      updateCartDto.guestSessionId !== undefined
        ? this.normalizeGuestSessionId(updateCartDto.guestSessionId)
        : cart.guestSessionId;

    this.validateAssociation(nextUserId, nextGuestSessionId);

    if (nextUserId !== null && nextUserId !== undefined) {
      await this.ensureUserExists(nextUserId);
      await this.ensureUserCartUnique(nextUserId, cartId);
    }

    if (nextGuestSessionId !== null) {
      await this.ensureGuestSessionIdUnique(nextGuestSessionId, cartId);
    }

    cart.userId = nextUserId ?? null;
    cart.guestSessionId = nextGuestSessionId ?? null;

    try {
      return await this.cartRepository.save(cart);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Failed to update cart');
      }

      throw error;
    }
  }

  async remove(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { cartId },
      relations: ['cartItems'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    if (cart.cartItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete cart that contains cart items',
      );
    }

    await this.cartRepository.delete(cartId);

    return {
      message: `Cart with id ${cartId} deleted successfully`,
    };
  }
}

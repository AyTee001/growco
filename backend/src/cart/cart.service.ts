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
import { Products } from 'src/entities/Products';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) { }

  async findOrCreateBySession(guestSessionId: string): Promise<Cart> {
    const normalizedId = this.normalizeGuestSessionId(guestSessionId);

    if (!normalizedId) {
      throw new BadRequestException('A valid guest session ID must be provided.');
    }

    let cart = await this.cartRepository.findOne({
      where: { guestSessionId: normalizedId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      cart = await this.create({
        guestSessionId: normalizedId,
        userId: undefined
      });
      cart.cartItems = [];
    }

    return cart;
  }

  async addItem(sessionId: string, productId: number, quantity: number) {
    let cart = await this.findOrCreateBySession(sessionId);

    let item = await this.cartItemsRepository.findOne({
      where: { cartId: cart.cartId, productId: productId }
    });

    const futureQuantity = item ? item.quantity + quantity : quantity;

    if (futureQuantity > 0) {
      await this.ensureStockAvailable(productId, futureQuantity);
    }

    if (item) {
      item.quantity = futureQuantity;
      if (item.quantity <= 0) {
        await this.cartItemsRepository.remove(item);
      } else {
        await this.cartItemsRepository.save(item);
      }
    } else if (quantity > 0) {
      item = this.cartItemsRepository.create({
        cartId: cart.cartId,
        productId: productId,
        quantity: quantity
      });
      await this.cartItemsRepository.save(item);
    }

    return this.findOne(cart.cartId);
  }

  async removeCartItem(sessionId: string, itemId: number) {
    const cart = await this.findOrCreateBySession(sessionId);
    await this.cartItemsRepository.delete({ itemId, cartId: cart.cartId });
    return this.findOne(cart.cartId);
  }

  async findOne(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { cartId },
      relations: ['user', 'cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    return cart;
  }

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

  async clearCart(userId?: number, guestSessionId?: string) {
    if (!userId && !guestSessionId) {
      throw new BadRequestException('Must provide either userId or guestSessionId to clear cart');
    }

    const cart = await this.cartRepository.findOne({
      where: userId ? { userId } : { guestSessionId },
    });

    if (!cart) {
      return { cartItems: [] };
    }

    await this.cartItemsRepository.delete({ cartId: cart.cartId });

    return this.findOne(cart.cartId);
  }

  async updateItemQuantity(sessionId: string, productId: number, targetQuantity: number) {
    let cart = await this.findOrCreateBySession(sessionId);

    let item = await this.cartItemsRepository.findOne({
      where: { cartId: cart.cartId, productId: productId }
    });

    // NEW: Validate before saving!
    if (targetQuantity > 0) {
      await this.ensureStockAvailable(productId, targetQuantity);
    }

    if (targetQuantity <= 0) {
      if (item) await this.cartItemsRepository.remove(item);
    } else {
      if (item) {
        item.quantity = targetQuantity;
        await this.cartItemsRepository.save(item);
      } else {
        item = this.cartItemsRepository.create({
          cartId: cart.cartId,
          productId: productId,
          quantity: targetQuantity
        });
        await this.cartItemsRepository.save(item);
      }
    }

    return this.findOne(cart.cartId);
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

  private async ensureStockAvailable(productId: number, requestedQuantity: number) {
    const product = await this.productsRepository.findOne({
      where: { productId }
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (requestedQuantity > product.qtyInStock) {
      throw new BadRequestException(
        `Cannot add ${requestedQuantity} items. Only ${product.qtyInStock} available in stock.`
      );
    }

    return product;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, groupBy, mergeMap, Subject, switchMap } from 'rxjs';
import { Cart, cartControllerAddToCart, cartControllerClear, cartControllerGetCurrent, cartControllerRemoveItem } from '../../../client';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  public readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this.cartSubject.asObservable();

  public readonly cartSignal = toSignal(this.cart$, { initialValue: null });

  private readonly quantityUpdate$ = new Subject<{ productId: number; targetQuantity: number }>();
  constructor() {
    this.initCart();
    this.setupDebouncedUpdates();
  }

  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

  hasItem(productId: number): boolean {
    const cart = this.cartSignal();

    if (!cart || !cart.cartItems) return false;

    return cart.cartItems.some(item => item.productId === productId);
  }

  getItemQuantity(productId: number): number {
    const cart = this.cartSignal();

    if (!cart || !cart.cartItems) return 0;

    const item = cart.cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  private setupDebouncedUpdates() {
    this.quantityUpdate$.pipe(
      groupBy(update => update.productId),
      mergeMap(group => group.pipe(
        debounceTime(400),
        switchMap(({ productId, targetQuantity }) =>
          cartControllerAddToCart({
            body: { productId, quantity: targetQuantity }
          })
        )
      ))
    ).subscribe(({ data, error }) => {
      if (!error && data) {
        this.cartSubject.next(data);
      }
    });
  }

  updateQuantity(productId: number, delta: number) {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const items = [...currentCart.cartItems];
    const itemIndex = items.findIndex(i => i.productId === productId);

    if (itemIndex === -1) return;

    const targetQuantity = items[itemIndex].quantity + delta;
    if (targetQuantity < 1) return; // Guard against negative/zero

    items[itemIndex] = { ...items[itemIndex], quantity: targetQuantity };
    this.cartSubject.next({ ...currentCart, cartItems: items });

    this.quantityUpdate$.next({ productId, targetQuantity });
  }

  open(): void {
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
  }

  toggle(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  private async initCart() {
    const { data, error } = await cartControllerGetCurrent();
    if (!error && data) this.cartSubject.next(data);
  }

  getItemsCount(): number {
    return this.cartSubject.value?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  getItemsTotal(): number {
    const items = this.cartSubject.value?.cartItems || [];
    return items.reduce((sum, item) => {
      const basePrice = item.product?.oldPrice || item.product?.price || 0;
      return sum + (basePrice * item.quantity);
    }, 0);
  }

  getDiscountTotal(): number {
    const items = this.cartSubject.value?.cartItems || [];
    return items.reduce((sum, item) => {
      const currentPrice = item.product?.price || 0;
      const oldPrice = item.product?.oldPrice || currentPrice;

      const savings = oldPrice > currentPrice ? oldPrice - currentPrice : 0;
      return sum + (savings * item.quantity);
    }, 0);
  }

  getServiceFee(): number {
    return this.getItemsTotal() > 0 ? 8 : 0;
  }

  getDeliveryFee(): number {
    return 0;
  }

  getTotalToPay(): number {
    const subtotal = this.getItemsTotal();
    const fees = this.getServiceFee() + this.getDeliveryFee();
    const savings = this.getDiscountTotal();

    const total = subtotal + fees - savings;

    return total > 0 ? total : 0;
  }

  async addItem(productId: number, quantity: number = 1) {
    const { data, error } = await cartControllerAddToCart({
      body: { productId, quantity }
    });
    if (!error && data) this.cartSubject.next(data);
  }

  async decreaseQuantity(productId: number) {
    await this.addItem(productId, -1);
  }

  async removeItem(itemId: number) {
    const { data, error } = await cartControllerRemoveItem({ path: { itemId } });
    if (!error && data) this.cartSubject.next(data);
  }

  async clear() {
    const currentCart = this.cartSubject.value;
    if (currentCart) {
      this.cartSubject.next({ ...currentCart, cartItems: [] });
    }

    const { data, error } = await cartControllerClear();

    if (!error && data) {
      this.cartSubject.next(data);
    } else if (error) {
      this.initCart();
      console.error('Failed to clear cart', error);
    }
  }

  async increment(productId: number) {
    const currentCart = this.cartSubject.value;
    const item = currentCart?.cartItems.find(i => i.productId === productId);

    if (item) {
      this.updateQuantity(productId, 1);
    } else {
      await this.addItem(productId, 1);
    }
  }
}
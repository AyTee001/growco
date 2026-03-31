import { Injectable } from '@angular/core';
import { BehaviorSubject, debounce, debounceTime, groupBy, mergeMap, scan, Subject, timer } from 'rxjs';
import { Cart, cartControllerAddToCart, cartControllerGetCurrent, cartControllerRemoveItem } from '../../../client';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this.cartSubject.asObservable();

  private readonly quantityUpdate$ = new Subject<{ productId: number; delta: number }>();

  constructor() {
    this.initCart();
    this.setupDebouncedUpdates();
  }

  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

  private setupDebouncedUpdates() {
    this.quantityUpdate$.pipe(
      groupBy(update => update.productId),
      mergeMap(group => group.pipe(
        scan((acc, curr) => ({
          productId: curr.productId,
          delta: acc.delta + curr.delta
        }), { productId: 0, delta: 0 }),
        debounceTime(500),
      ))
    ).subscribe(async (finalUpdate) => {
      if (finalUpdate.delta === 0) return;

      const { data, error } = await cartControllerAddToCart({
        body: {
          productId: finalUpdate.productId,
          quantity: finalUpdate.delta
        }
      });

      if (!error && data) {
        this.cartSubject.next(data);
      }

    });
  }

  // Inside BasketService (Angular)
  async updateQuantity(productId: number, delta: number) {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const item = currentCart.cartItems.find(i => i.productId === productId);

    const currentQty = item ? item.quantity : 0;
    const targetQuantity = currentQty + delta;

    if (targetQuantity < 0) return; // Guard

    const updatedItems = currentCart.cartItems.map(i => {
      if (i.productId === productId) {
        return { ...i, quantity: targetQuantity };
      }
      return i;
    });

    this.cartSubject.next({ ...currentCart, cartItems: updatedItems });

    const { data, error } = await cartControllerAddToCart({
      body: {
        productId,
        quantity: targetQuantity
      }
    });

    if (!error && data) {
      this.cartSubject.next(data);
    }
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
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  getDiscountTotal(): number {
    const items = this.cartSubject.value?.cartItems || [];
    return items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const oldPrice = item.product?.oldPrice || price;

      const savingsPerItem = oldPrice > price ? oldPrice - price : 0;
      return sum + (savingsPerItem * item.quantity);
    }, 0);
  }

  getServiceFee(): number {
    return this.getItemsTotal() > 0 ? 8 : 0;
  }

  getDeliveryFee(): number {
    return 0;
  }

  getTotalToPay(): number {
    const itemsTotal = this.cartSubject.value?.cartItems?.reduce((sum, item) =>
      sum + (item.product?.price || 0) * item.quantity, 0) || 0;
    return itemsTotal > 0 ? itemsTotal + 8 : 0;
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
}
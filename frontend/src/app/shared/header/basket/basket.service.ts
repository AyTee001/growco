import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, cartControllerAddToCart, cartControllerGetCurrent, cartControllerRemoveItem } from '../../../client';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this.cartSubject.asObservable();

  constructor() {
    this.initCart();
  }

  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

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
    if (!error && data) {
      this.cartSubject.next(data);
    }
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
    return this.getItemsTotal() + this.getServiceFee() + this.getDeliveryFee();
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
    const { data, error } = await cartControllerRemoveItem({
      path: { itemId }
    });
    if (!error && data) this.cartSubject.next(data);
  }
}
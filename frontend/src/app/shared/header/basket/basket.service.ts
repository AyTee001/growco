import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasketItemModel } from './basket-item.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly itemsSubject = new BehaviorSubject<BasketItemModel[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

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

  getItems(): BasketItemModel[] {
    return this.itemsSubject.value;
  }

  setItems(items: BasketItemModel[]): void {
    this.itemsSubject.next(items);
  }

  addItem(item: BasketItemModel): void {
    const items = [...this.itemsSubject.value];
    const existingItem = items.find(existing => existing.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      items.push({
        ...item,
        quantity: item.quantity || 1
      });
    }

    this.itemsSubject.next(items);
  }

  removeItem(itemId: number | string): void {
    const updatedItems = this.itemsSubject.value.filter(item => item.id !== itemId);
    this.itemsSubject.next(updatedItems);
  }

  increaseQuantity(itemId: number | string): void {
    const updatedItems = this.itemsSubject.value.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    this.itemsSubject.next(updatedItems);
  }

  decreaseQuantity(itemId: number | string): void {
    const updatedItems = this.itemsSubject.value
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    this.itemsSubject.next(updatedItems);
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  getItemsTotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  getServiceFee(): number {
    return this.getItemsTotal() > 0 ? 8 : 0;
  }

  getDeliveryFee(): number {
    return this.getItemsTotal() > 0 ? 0 : 0;
  }

  getTotalWeight(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      return sum + item.weight * item.quantity;
    }, 0);
  }

  getDiscountTotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      return sum + (item.discount || 0) * item.quantity;
    }, 0);
  }

  getTotalToPay(): number {
    return this.getItemsTotal() + this.getServiceFee() + this.getDeliveryFee() - this.getDiscountTotal();
  }

  getItemsCount(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }
}
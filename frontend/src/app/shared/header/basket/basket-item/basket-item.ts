import { Component, Input } from '@angular/core';
import { CartItems } from '../../../../client';
import { BasketService } from '../basket.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './basket-item.html',
  styleUrls: ['./basket-item.scss']
})
export class BasketItem {
  @Input({ required: true }) item!: CartItems; 

  constructor(private basketService: BasketService) {}

  increase(): void {
    if (this.item.quantity < this.item.product.qtyInStock) {
      this.basketService.updateQuantity(this.item.productId, 1);
    }
  }

  decrease(): void {
    if (this.item.quantity > 1) {
      this.basketService.updateQuantity(this.item.productId, -1);
    }
  }

  remove(): void {
    this.basketService.removeItem(this.item.itemId);
  }
}
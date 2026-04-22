import { Component, inject, Input } from '@angular/core';
import { CartItems } from '../../../../client';
import { BasketService } from '../basket.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './basket-item.html',
  styleUrls: ['./basket-item.scss']
})
export class BasketItem {
  private router = inject(Router);
  public basketService = inject(BasketService);

  @Input({ required: true }) item!: CartItems;

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

  public navigateToProduct(): void {
    this.router.navigateByUrl(`/product/${this.item.productId}`);
    this.basketService.close();
  }

}
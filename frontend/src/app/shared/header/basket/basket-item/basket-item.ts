import { Component, Input } from '@angular/core';
import { CartItems } from '../../../../client';
import { BasketService } from '../basket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket-item.html',
  styleUrls: ['./basket-item.scss']
})
export class BasketItem {
  @Input({ required: true }) item!: CartItems; 

  constructor(private basketService: BasketService) {}

  increase(): void {
    this.basketService.addItem(this.item.productId, 1);
  }

  decrease(): void {
    this.basketService.decreaseQuantity(this.item.productId);
  }

  remove(): void {
    this.basketService.removeItem(this.item.itemId);
  }
}
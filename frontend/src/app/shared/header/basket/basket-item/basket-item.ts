import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BasketItemModel } from '../basket-item.model';
import { BasketService } from '../basket.service';

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket-item.html',
  styleUrls: ['./basket-item.scss']
})
export class BasketItem {
  @Input({ required: true }) item!: BasketItemModel;

  constructor(private basketService: BasketService) {}

  increase(): void {
    this.basketService.increaseQuantity(this.item.id);
  }

  decrease(): void {
    this.basketService.decreaseQuantity(this.item.id);
  }

  remove(): void {
    this.basketService.removeItem(this.item.id);
  }
}
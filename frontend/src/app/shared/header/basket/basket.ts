import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BasketService } from './basket.service';
import { BasketItem } from './basket-item/basket-item';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketItem],
  templateUrl: './basket.html',
  styleUrls: ['./basket.scss']
})
export class Basket {
  constructor(public basketService: BasketService) {}

  close(): void {
    this.basketService.close();
  }

  clear(): void {
    this.basketService.clear();
  }

  trackById(index: number, item: any): number | string {
    return item.id;
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  public basketService = inject(BasketService);

  close(): void {
    this.basketService.close();
  }

  clear(): void {
  }
}
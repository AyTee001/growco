import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Products } from '../../client';
import { Router } from '@angular/router';
import { BasketService } from '../header/basket/basket.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  private router = inject(Router);
  private basketService = inject(BasketService);

  product = input.required<Products>();

  public navigateToProduct(): void {
    this.router.navigateByUrl(`/product/${this.product().productId}`)
  }

  public addToCart() {
    this.basketService.increment(this.product().productId)
  }
}
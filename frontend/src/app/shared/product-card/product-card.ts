import { Component, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Products } from '../../client';
import { Router } from '@angular/router';
import { BasketService } from '../header/basket/basket.service';
import { MatTooltipModule } from '@angular/material/tooltip'
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  private router = inject(Router);
  private basketService = inject(BasketService);

  product = input.required<Products>();
  cartQuantity = computed(() => this.basketService.getItemQuantity(this.product().productId));
  isInCart = computed(() => this.basketService.hasItem(this.product().productId));

  public navigateToProduct(): void {
    this.router.navigateByUrl(`/product/${this.product().productId}`);
  }

  public addToCart() {
    this.basketService.increment(this.product().productId);
  }
}
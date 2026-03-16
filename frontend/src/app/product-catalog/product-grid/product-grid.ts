import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductCardComponent } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.html',
  styleUrls: ['./product-grid.scss']
})
export class ProductGridComponent {
  items = input.required<Product[]>();
  addToCart = output<Product>();

  onCardClick(product: Product): void {
    this.addToCart.emit(product);
  }
}
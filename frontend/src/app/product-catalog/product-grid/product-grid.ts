import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/product-card/product-card';
import { Products } from '../../client';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.html',
  styleUrls: ['./product-grid.scss']
})
export class ProductGridComponent {
  items = input.required<Products[]>();
  addToCart = output<Products>();

  onCardClick(product: Products): void {
    this.addToCart.emit(product);
  }
}
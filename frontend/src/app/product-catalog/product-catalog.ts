import { Component, computed, inject, input } from '@angular/core';
import { ProductService } from './products.service';

@Component({
  selector: 'app-product-catalog',
  imports: [],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss',
})
export class ProductCatalog {
  private productService = inject(ProductService);

  readonly categoryId = input.required<string>();

  readonly categoryData = computed(() => {
    const id = this.categoryId();
    //return this.productService.getProductsByCategory(id);
    return [];
  });
}

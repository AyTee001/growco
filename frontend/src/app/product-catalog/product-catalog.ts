import { Component, input, computed, numberAttribute, signal, effect } from '@angular/core';
import { Products, productsControllerFindAllByCategory } from '../client';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  templateUrl: './product-catalog.html',
})
export class ProductCatalog {
  readonly categoryId = input.required({ transform: numberAttribute });

  products = signal<Products[]>([]);
  isLoading = signal(false);

  constructor() {
    effect(async () => {
      const id = this.categoryId();
      this.isLoading.set(true);

      const data = await this.getProductsByCategory(id);

      this.products.set(data as []);
      this.isLoading.set(false);
    });
  }

  async getProductsByCategory(id: number): Promise<Products[]> {
    const { data, error } = await productsControllerFindAllByCategory({
      path: { categoryId: id }
    });

    if (error) {
      console.error('API Error:', error);
      return [];
    }

    return data || [];
  }
}
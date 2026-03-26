import { Component, input, computed, numberAttribute, signal, effect, inject } from '@angular/core';
import { Products, productsControllerFindAllByCategory } from '../client';
import { ProductGridComponent } from "./product-grid/product-grid";
import { SortSelectComponent } from "../shared/sort-select/sort-select";
import { FilterSidebarComponent } from "../shared/filter-sidebar/filter-sidebar";
import { MatIcon } from "@angular/material/icon";
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss',
  imports: [ProductGridComponent, SortSelectComponent, FilterSidebarComponent, MatIcon],
})
export class ProductCatalog {
  private categoryService = inject(CategoryService);

  readonly categoryId = input.required({ transform: numberAttribute });

  products = signal<Products[]>([]);
  isLoading = signal(false);

  breadcrumbs = computed(() =>
    this.categoryService.getCategoryPath(this.categoryId())
  );

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
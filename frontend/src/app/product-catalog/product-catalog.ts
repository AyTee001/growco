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
  readonly sort = signal('price_asc')

  products = signal<Products[]>([]);
  isLoading = signal(false);

  breadcrumbs = computed(() =>
    this.categoryService.getCategoryPath(this.categoryId())
  );

  constructor() {
    effect(async () => {
      this.getProducts();
    });
  }

  public onSortChanged(newSortValue: string) {
    this.sort.set(newSortValue);
  }

  private async getProducts() {
    const id = this.categoryId();
    const sort = this.sort();
    this.isLoading.set(true);

    const data = await this.getProductsByCategory(id, sort);

    this.products.set(data as []);
    this.isLoading.set(false);
  }

  async getProductsByCategory(id: number, sort: string): Promise<Products[]> {
    const { data, error } = await productsControllerFindAllByCategory({
      query: { sort: sort },
      path: { categoryId: id }
    });

    if (error) {
      console.error('API Error:', error);
      return [];
    }

    return data || [];
  }
}
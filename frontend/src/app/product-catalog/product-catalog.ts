import { Component, input, computed, numberAttribute, signal, effect, inject } from '@angular/core';
import { Products, productsControllerFindAllByCategory, productsControllerGetFilterOptions } from '../client';
import { ProductGridComponent } from "./product-grid/product-grid";
import { SortSelectComponent } from "../shared/sort-select/sort-select";
import { FilterCategory, FilterSidebarComponent } from "../shared/filter-sidebar/filter-sidebar";
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
  readonly sort = signal('price_asc');
  readonly activeFilters = signal<any>({});
  filterConfig = signal<FilterCategory[]>([]);
  products = signal<Products[]>([]);
  isLoading = signal(false);

  breadcrumbs = computed(() =>
    this.categoryService.getCategoryPath(this.categoryId())
  );

  constructor() {
    effect(async () => {
      const id = this.categoryId();
      this.getProducts();
      this.loadFilterOptions(id);
    });
  }

  private async loadFilterOptions(categoryId: number) {
    const { data, error } = await productsControllerGetFilterOptions({
      path: { categoryId }
    });

    if (error || !data) {
      console.error('Failed to load filters', error);
      return;
    }

    console.log(data);
    const newConfig: FilterCategory[] = [
      {
        key: 'price',
        categoryName: 'Ціна',
        type: 'range',
        min: data.minPrice,
        max: data.maxPrice
      },
      {
        key: 'isPromo',
        categoryName: 'Пропозиції',
        type: 'checkbox',
        options: [
          { label: 'Тільки акційні товари', value: true }
        ]
      },
      {
        key: 'brands',
        categoryName: 'Бренд',
        type: 'checkbox',
        options: data.brands.map((brand: any) => ({ label: brand, value: brand }))
      },
    ];

    this.filterConfig.set(newConfig);
  }

  public onSortChanged(newSortValue: string) {
    this.sort.set(newSortValue);
  }

  public onFiltersApplied(filters: any) {
    this.activeFilters.set(filters);
  }

  private async getProducts() {
    const id = this.categoryId();
    const sort = this.sort();
    const filters = this.activeFilters();

    this.isLoading.set(true);
    const data = await this.getProductsByCategory(id, sort, filters);
    this.products.set(data);
    this.isLoading.set(false);
  }

  async getProductsByCategory(id: number, sort: string, filters: any): Promise<Products[]> {
    const { data, error } = await productsControllerFindAllByCategory({
      path: { categoryId: id },
      query: {
        sort: sort,
        minPrice: filters.price?.min,
        maxPrice: filters.price?.max,
        brands: filters.brands,
        isPromo: filters.isPromo?.includes(true) || filters.isPromo === true
      } as any
    });

    if (error) {
      console.error('API Error:', error);
      return [];
    }

    return data || [];
  }
}
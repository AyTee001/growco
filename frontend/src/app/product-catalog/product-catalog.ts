import { Component, input, computed, numberAttribute, signal, effect, inject } from '@angular/core';
import { Products, productsControllerFindAll, productsControllerFindAllOptions } from '../client';
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

  readonly categoryId = input<number | null, any>(null, {
    transform: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return numberAttribute(value);
    }
  });
  readonly q = input<string | null>(null);
  readonly sort = signal('price_asc');
  readonly activeFilters = signal<any>({});

  filterConfig = signal<FilterCategory[]>([]);
  products = signal<Products[]>([]);
  isLoading = signal(false);

  breadcrumbs = computed(() => {
    const id = this.categoryId();
    if (id) return this.categoryService.getCategoryPath(id);
    if (this.q()) return [{ name: 'Пошук', id: 0 }, { name: `"${this.q()}"`, id: 0 }];
    return [{ name: 'Каталог', id: 0 }];
  });

  constructor() {
    effect(async () => {
      this.getProducts();
      this.loadFilterOptions();
    });
  }

  private async loadFilterOptions() {
    const id = this.categoryId();
    const searchTerm = this.q();

    const { data, error } = await productsControllerFindAllOptions({
      query: {
        categoryId: id ?? undefined,
        search: searchTerm ?? undefined
      }
    });

    if (error || !data) return;
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
    const data = await this.getProductsByQuery(id, sort, filters);
    this.products.set(data);
    this.isLoading.set(false);
  }

  async getProductsByQuery(id: number | null, sort: string, filters: any): Promise<Products[]> {
    const searchTerm = this.q();

    const { data, error } = await productsControllerFindAll({
      query: {
        categoryId: id,
        sort: sort,
        search: searchTerm,
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
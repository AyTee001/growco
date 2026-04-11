import { Component, input, computed, numberAttribute, signal, effect, inject, untracked } from '@angular/core';
import { Products, productsControllerFindAll, productsControllerFindAllOptions } from '../client';
import { ProductGridComponent } from "./product-grid/product-grid";
import { SortSelectComponent } from "../shared/sort-select/sort-select";
import { FilterCategory, FilterSidebarComponent } from "../shared/filter-sidebar/filter-sidebar";
import { MatIcon } from "@angular/material/icon";
import { CategoryService } from '../shared/services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss',
  imports: [ProductGridComponent, SortSelectComponent, FilterSidebarComponent, MatIcon],
})
export class ProductCatalog {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  readonly categoryId = input<number | null, any>(null, {
    transform: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return numberAttribute(value);
    }
  });
  readonly q = input<string | null>(null);

  readonly promo = signal(false);
  readonly week = signal(false);
  readonly isNew = signal(false);
  
  // Notice we moved the initial state to the top for easy resetting
  readonly initialSort = 'price_asc';
  readonly sort = signal(this.initialSort);
  readonly activeFilters = signal<any>({});

  filterConfig = signal<FilterCategory[]>([]);
  products = signal<Products[]>([]);
  isLoading = signal(false);

  breadcrumbs = computed(() => {
    const id = this.categoryId();
  
    if (id) return this.categoryService.getCategoryPath(id);
    if (this.promo()) return [{ name: 'Каталог', id: 0 }, { name: 'Всі акції', id: 0 }];
    if (this.week()) return [{ name: 'Каталог', id: 0 }, { name: 'Товари тижня', id: 0 }];
    if (this.isNew()) return [{ name: 'Каталог', id: 0 }, { name: 'Новинки', id: 0 }];
    if (this.q()) return [{ name: 'Пошук', id: 0 }, { name: `"${this.q()}"`, id: 0 }];
  
    return [{ name: 'Каталог', id: 0 }];
  });

  constructor() {

    this.route.queryParams.subscribe(params => {
      this.promo.set(params['promo'] === 'true');
      this.week.set(params['week'] === 'true');
      this.isNew.set(params['new'] === 'true');
    });

    effect(() => {
      const id = this.categoryId();
      const searchTerm = this.q();
      const promoOnly = this.promo();
      const weekOnly = this.week();
      const newOnly = this.isNew();
    
      untracked(() => {
        let filters: any = {};
    
        if (promoOnly) {
          filters.isPromo = [true];
        }
    
        this.activeFilters.set(filters);
        this.filterConfig.set([]);
        this.loadFilterOptions(id, searchTerm);
      });
    }, { allowSignalWrites: true });

    effect(() => {
      const id = this.categoryId();
      const searchTerm = this.q();
      const promoOnly = this.promo();
      const weekOnly = this.week();
      const newOnly = this.isNew();
      const currentSort = this.sort();
      const currentFilters = this.activeFilters();
    
      untracked(() => {
        this.getProducts(id, searchTerm, promoOnly, weekOnly, newOnly, currentSort, currentFilters);
      });
    }, { allowSignalWrites: true });
  }

  private async loadFilterOptions(id: number | null, searchTerm: string | null) {
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

  private async getProducts(id: number | null, searchTerm: string | null, promoOnly: boolean, weekOnly: boolean,
    newOnly: boolean, sort: string, filters: any
  ) 
  
  {
    this.isLoading.set(true);
    
    const { data, error } = await productsControllerFindAll({
      query: {
        categoryId: id,
        sort: newOnly ? 'createdAt_desc' : sort, // новинки
        search: searchTerm,
        minPrice: filters.price?.min,
        maxPrice: filters.price?.max,
        brands: filters.brands,
    
        isPromo: promoOnly || filters.isPromo?.includes(true),
    
        // обмеження для новинок
        limit: weekOnly ? 30 : newOnly ? 30 : undefined,
    
        randomSeed: weekOnly ? this.getWeekSeed() : undefined
      } as any
    });

    if (error) {
      console.error('API Error:', error);
      this.products.set([]);
    } else {
      this.products.set(data || []);
    }
    
    this.isLoading.set(false);

    
  }

  private getWeekSeed(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
  
    return Math.floor(diff / oneWeek);
  }
}
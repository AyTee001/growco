import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BannerSectionComponent } from './banner-section/banner-section';
import { CategoryCard } from './category-card/category-card';
import { Products, productsControllerFindCollection } from '../client'; 
import { ProductSliderComponent } from "../shared/product-slider/product-slider";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    BannerSectionComponent,
    CategoryCard,
    ProductSliderComponent
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage implements OnInit {

  private readonly router = inject(Router);

  readonly leftImages = [
    'images/banners/banner.png',
    'images/banners/banner2.png'
  ];

  readonly extraCategories1 = [
    { categoryId: 43, title: 'Макарони', image: 'images/categories/pasta.svg', bgColor: '#E6E8DF' },
    { categoryId: 13, title: 'Птиця', image: '/images/categories/chicken.svg', bgColor: '#EFCFD3' },
    { categoryId: 52, title: 'Піца та напівфабрикати', image: '/images/categories/pizza.svg', bgColor: '#DDE7CF' },
    { categoryId: 56, title: 'Соки', image: '/images/categories/1.png', bgColor: '#DDE7CF' },
    { categoryId: 31, title: 'Фрукти', image: '/images/categories/fruits.png', bgColor: '#CFE3E7' }
  ];
  
  readonly extraCategories2 = [
    { categoryId: 32, title: 'Овочі', image: '/images/categories/vegetables.svg', bgColor: '#A9C37A' },
    { categoryId: 39, title: 'Торти та десерти', image: '/images/categories/desserts.svg', bgColor: '#E2B8C8' },
    { categoryId: 57, title: 'Газовані напої', image: '/images/categories/drinks.svg', bgColor: '#F0C987' },
    { categoryId: 58, title: 'Кава та чай', image: '/images/categories/coffee.svg', bgColor: '#D6C9B3' },
    { categoryId: 12, title: 'Свіже м’ясо', image: '/images/categories/meat.svg', bgColor: '#B7CFB2' }
  ];

  // Create individual signals for each slider
  readonly quickTastyProducts = signal<Products[]>([]);
  readonly facouriteCandies = signal<Products[]>([]);
  readonly morningCoffeeProducts = signal<Products[]>([]);
  readonly freshVitaminsProducts = signal<Products[]>([]);

  ngOnInit() {
    this.loadSliderCollections();
  }

  private async loadSliderCollections() {
    const [quickTasty, candies, morningCoffee, freshVitamins] = await Promise.all([
      this.fetchCollection('quick-tasty'),
      this.fetchCollection('favourite-candies'),
      this.fetchCollection('morning-coffee'),
      this.fetchCollection('fresh-vitamins')
    ]);

    this.quickTastyProducts.set(quickTasty);
    this.facouriteCandies.set(candies);
    this.morningCoffeeProducts.set(morningCoffee);
    this.freshVitaminsProducts.set(freshVitamins);
  }

  private async fetchCollection(slug: string): Promise<Products[]> {
    const { data, error } = await productsControllerFindCollection({
      path: { slug }
    });

    if (error) {
      console.error(`Failed to load collection ${slug}:`, error);
      return [];
    }
    
    return data || [];
  }

  onAddToCart(product: Products): void {
    console.log('Added to cart:', product);
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/catalog'], {
      queryParams: { categoryId }
    });
  }

  onBannerCardClick(event: { id: string; title: string }): void {
    if (event.id === 'about') {
      this.router.navigate(['/about-us']);
      return;
    }
  
    if (event.id === 'discounts') {
      this.router.navigate(['/catalog'], {
        queryParams: { promo: true }
      });
      return;
    }
  
    if (event.id === 'week-products') {
      this.router.navigate(['/catalog'], {
        queryParams: { week: true }
      });
      return;
    }
  
    if (event.id === 'new-items') {
      this.router.navigate(['/catalog'], {
        queryParams: { new: true }
      });
      return;
    }
  }
}
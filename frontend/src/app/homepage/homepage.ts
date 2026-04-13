import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BannerSectionComponent } from './banner-section/banner-section';
import { CategoryCard } from './category-card/category-card';
import { Products } from '../client';
import { ProductSliderComponent } from "../shared/product-slider/product-slider";
import { ProductService } from '../shared/services/product.service';

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
  private readonly productService = inject(ProductService);

  readonly leftImages = [
    'images/banners/banner.png',
    'images/banners/banner2.png'
  ];

  quickTastyItems: Products[] = [];
  candyBoxesItems: Products[] = [];
  sweetSpreadsItems: Products[] = [];
  proteinYogurtsItems: Products[] = [];

  readonly extraCategories1 = [
    { title: 'Макарони', image: 'images/categories/pasta.svg', bgColor: '#E6E8DF' },
    { title: 'Птиця', image: '/images/categories/chicken.svg', bgColor: '#EFCFD3' },
    { title: 'Піца та напівфабрикати', image: '/images/categories/pizza.svg', bgColor: '#DDE7CF' },
    { title: 'Соки', image: '/images/categories/1.png', bgColor: '#DDE7CF' },
    { title: 'Фрукти', image: '/images/categories/fruits.png', bgColor: '#CFE3E7' }
  ];

  readonly extraCategories2 = [
    { title: 'Овочі', image: '/images/categories/vegetables.svg', bgColor: '#A9C37A' },
    { title: 'Торти та десерти', image: '/images/categories/desserts.svg', bgColor: '#E2B8C8' },
    { title: 'Газовані напої', image: '/images/categories/drinks.svg', bgColor: '#F0C987' },
    { title: 'Кава та чай', image: '/images/categories/coffee.svg', bgColor: '#D6C9B3' },
    { title: "Свіже м'ясо", image: '/images/categories/meat.svg', bgColor: '#B7CFB2' }
  ];

  ngOnInit(): void {
    this.productService.getCollection('quick-tasty').subscribe({
      next: (items) => this.quickTastyItems = items,
      error: (err) => console.error('quick-tasty collection error', err)
    });

    this.productService.getCollection('candy-boxes').subscribe({
      next: (items) => this.candyBoxesItems = items,
      error: (err) => console.error('candy-boxes collection error', err)
    });

    this.productService.getCollection('sweet-spreads').subscribe({
      next: (items) => this.sweetSpreadsItems = items,
      error: (err) => console.error('sweet-spreads collection error', err)
    });

    this.productService.getCollection('protein-yogurts').subscribe({
      next: (items) => this.proteinYogurtsItems = items,
      error: (err) => console.error('protein-yogurts collection error', err)
    });
  }

  onAddToCart(product: Products): void {
    console.log('Added to cart:', product);
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
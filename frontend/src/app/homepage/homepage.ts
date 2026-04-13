import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BannerSectionComponent } from './banner-section/banner-section';
import { CategoryCard } from './category-card/category-card';
import { Products } from '../client';
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
  private readonly http = inject(HttpClient);

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
    this.http.get<Products[]>('/api/products').subscribe({
      next: (all) => {
        // Split 40 seed products into 4 groups of 10 each
        this.quickTastyItems    = all.slice(0, 10);
        this.candyBoxesItems    = all.slice(10, 20);
        this.sweetSpreadsItems  = all.slice(20, 30);
        this.proteinYogurtsItems = all.slice(30, 40);
      },
      error: (err) => console.error('Failed to load products', err)
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
      this.router.navigate(['/catalog'], { queryParams: { promo: true } });
      return;
    }
    if (event.id === 'week-products') {
      this.router.navigate(['/catalog'], { queryParams: { week: true } });
      return;
    }
    if (event.id === 'new-items') {
      this.router.navigate(['/catalog'], { queryParams: { new: true } });
      return;
    }
  }
}
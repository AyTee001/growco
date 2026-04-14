import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
export class Homepage {

  private readonly router = inject(Router);

  readonly leftImages = [
    'images/banners/banner.png',
    'images/banners/banner2.png'
  ];


  public readonly dummy_items: Products[] = [
    {
      productId: 1,
      name: 'Вода Borjomi',
      description: 'Натуральна мінеральна вода вулканічного походження.',
      price: 35.50,
      qtyInStock: 50,
      imgUrl: '/products/borjomi.png',
      brand: 'Borjomi',
      originCountry: 'Georgia',
      isPromo: false,
      netContent: 0.5,
      unit: 'л',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 2,
      name: 'Coca-Cola Classic',
      description: 'Класичний освіжаючий напій.',
      price: 28.00,
      oldPrice: 32.00,
      qtyInStock: 100,
      imgUrl: '/products/coca-cola.png',
      brand: 'Coca-Cola',
      originCountry: 'Ukraine',
      isPromo: true,
      netContent: 0.5,
      unit: 'л',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 3,
      name: 'Lays Сметана та зелень',
      description: 'Хрустка картопля зі смаком ніжної сметани.',
      price: 45.90,
      qtyInStock: 30,
      imgUrl: '/products/lays-sour-cream.png',
      brand: 'Lays',
      originCountry: 'Ukraine',
      isPromo: false,
      netContent: 120,
      unit: 'г',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 4,
      name: 'Monster Energy',
      description: 'Енергетичний напій для максимального заряду.',
      price: 42.00,
      qtyInStock: 25,
      imgUrl: '/products/monster-energy.png',
      brand: 'Monster',
      originCountry: 'Ireland',
      isPromo: false,
      netContent: 0.5,
      unit: 'л',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 5,
      name: 'Печиво Oreo',
      description: 'Легендарне шоколадне печиво з кремовою начинкою.',
      price: 38.00,
      qtyInStock: 40,
      imgUrl: '/products/oreo.png',
      brand: 'Oreo',
      originCountry: 'Poland',
      isPromo: false,
      netContent: 154,
      unit: 'г',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 6,
      name: 'Pepsi Zero Sugar',
      description: 'Максимальний смак, нуль цукру.',
      price: 26.50,
      qtyInStock: 80,
      imgUrl: '/products/pepsi-zero.png',
      brand: 'Pepsi',
      originCountry: 'Ukraine',
      isPromo: true,
      oldPrice: 30.00,
      netContent: 0.5,
      unit: 'л',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 7,
      name: 'Сік Sandora Апельсин',
      description: '100% натуральний апельсиновий сік.',
      price: 65.00,
      qtyInStock: 15,
      imgUrl: '/products/sandora-orange.png',
      brand: 'Sandora',
      originCountry: 'Ukraine',
      isPromo: false,
      netContent: 1,
      unit: 'л',
      cartItems: [],
      orderItems: [],
      categories: []
    },
    {
      productId: 8,
      name: 'Батончик Snickers',
      description: 'Смажений арахіс, карамель та нуга в шоколаді.',
      price: 22.00,
      qtyInStock: 120,
      imgUrl: '/products/snickers.png',
      brand: 'Mars',
      originCountry: 'Netherlands',
      isPromo: false,
      netContent: 50,
      unit: 'г',
      cartItems: [],
      orderItems: [],
      categories: []
    }
  ];

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
    { title: 'Свіже м’ясо', image: '/images/categories/meat.svg', bgColor: '#B7CFB2' }
  ];

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
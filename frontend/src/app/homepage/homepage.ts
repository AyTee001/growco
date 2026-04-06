import { Component } from '@angular/core';
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
  readonly leftImages = [
    'assets/banner/banner-1.png',
    'assets/banner/banner-2.png'
  ];

  readonly extraCategories1 = [
    { title: 'Макарони', image: 'images/categories/pasta.svg',  bgColor: '#E6E8DF' },
    { title: 'Птиця', image: '/images/categories/chicken.svg',bgColor: '#EFCFD3' },
    { title: 'Піца та напівфабрикати', image: '/images/categories/pizza.svg', bgColor: '#DDE7CF' },
    { title: 'Соки', image: '/images/categories/1.png', bgColor: '#DDE7CF' },
    { title: 'Фрукти', image: '/images/categories/fruits.png', bgColor: '#CFE3E7' }
  ];
  
  readonly extraCategories2 = [
    { title: 'Овочі', image: '/images/categories/vegetables.svg',  bgColor: '#A9C37A' },
    { title: 'Торти та десерти', image: '/images/categories/desserts.svg',bgColor: '#E2B8C8' },
    { title: 'Газовані напої', image: '/images/categories/drinks.svg', bgColor: '#F0C987' },
    { title: 'Кава та чай', image: '/images/categories/coffee.svg', bgColor: '#D6C9B3' },
    { title: 'Свіже м’ясо', image: '/images/categories/meat.svg', bgColor: '#B7CFB2' }
  ];

  onAddToCart(product: Products): void {
    console.log('Added to cart:', product);
  }
}
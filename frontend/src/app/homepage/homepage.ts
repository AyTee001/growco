import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { BannerSectionComponent } from './banner-section/banner-section';
import { CategoryCard } from './category-card/category-card';
import { Product } from '../shared/product-card/product-card';
import { ProductSliderComponent } from "../shared/product-slider/product-slider";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    Header,
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

  readonly products: Product[] = [
    {
      imageUrl: 'assets/products/noodles.png',
      name: 'Вермішель «Мівіна»',
      description: 'з соусом солодкий чилі',
      price: 42.0,
      unit: '75 г'
    },
    {
      imageUrl: 'assets/products/reeva.png',
      name: 'Вермішель Reeva',
      description: 'зі смаком курки',
      price: 18.69,
      unit: '60 г'
    },
    {
      imageUrl: 'assets/products/pelmeni.png',
      name: 'Пельмені «Три ведмеді»',
      description: 'зі смаком індички',
      price: 310.0,
      unit: '800 г'
    },
    {
      imageUrl: 'assets/products/varenyky.png',
      name: 'Вареники «Три Ведмеді»',
      description: 'з картоплею',
      price: 70.0,
      unit: '400 г'
    },
    {
      imageUrl: 'assets/products/puree.png',
      name: 'Пюре Reeva',
      description: 'швидкого приготування',
      price: 38.2,
      unit: '60 г'
    },
    {
      imageUrl: 'assets/products/cordero.png',
      name: 'Полента Cordero',
      description: 'швидкого приготування',
      price: 90.0,
      unit: '250 г'
    }
  ];

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
  }
}
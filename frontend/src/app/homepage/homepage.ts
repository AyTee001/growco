import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { BannerSectionComponent } from './banner-section/banner-section';
import { ProductGridComponent } from '../product-catalog/product-grid/product-grid';
import { CategoryCard } from './category-card/category-card';
import { Product } from '../shared/product-card/product-card';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    Header,
    BannerSectionComponent,
    ProductGridComponent,
    CategoryCard
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
      name: 'Вермішель швидкого приготування',
      description: 'Зі смаком яловичини',
      price: 42,
      unit: '75 г'
    }
  ];

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
  }
}
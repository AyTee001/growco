import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ProductSliderComponent } from "../../shared/product-slider/product-slider";
import { MatCardModule } from "@angular/material/card";
import { Products } from '../../client';

export interface ProductData {
  name: string;
  seller: string;
  price: number;
  quantity: number;
  quantityMeasure: string;
  imageUrl: string;
  description: string;
  country: string;
  brand: string;
}

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    ProductSliderComponent,
    MatCardModule
],
  templateUrl: './product-panel.html',
  styleUrl: './product-panel.scss',
})
export class ProductPanel {
  data = input.required<ProductData>();
  similarProducts = input.required<Products[]>();
  addToCart = output<ProductData>();
}

import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, numberAttribute, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ProductSliderComponent } from "../../shared/product-slider/product-slider";
import { MatCardModule } from "@angular/material/card";
import { Products, productsControllerFindOne, productsControllerFindSimilar } from '../../client';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { BasketService } from '../../shared/header/basket/basket.service';

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
  private basketService = inject(BasketService);
  
  productId = input.required({
    transform: (value: unknown) => numberAttribute(value, 0)
  });

  public productResource = toSignal(
    toObservable(this.productId).pipe(
      filter(id => id > 0),
      switchMap(id => this.findOneProduct(id))
    )
  );

  public similarProductsResource = toSignal(
    toObservable(this.productId).pipe(
      filter(id => id > 0),
      switchMap(id => this.fetchSimilar(id))
    ),
    { initialValue: [] as Products[] }
  );

  private async findOneProduct(id: number) {
    const { data, error } = await productsControllerFindOne({
      path: { id }
    });
    return error || !data ? undefined : data;
  }

  private async fetchSimilar(id: number) {
    const { data, error } = await productsControllerFindSimilar({
      path: { id }
    });
    return error || !data ? [] : data;
  }

  data = computed(() => this.productResource());
  similarProducts = computed(() => this.similarProductsResource());

  cartQuantity = computed(() => this.basketService.getItemQuantity(this.productId()));

  public addToCart() {
    this.basketService.increment(this.productId())
  }
}

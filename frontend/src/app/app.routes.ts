import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us/about-us';
import { ProductPanel } from './product/product/product-panel'; 
import { ProductCatalog } from './product-catalog/product-catalog/product-catalog';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
  { path: '', component: Homepage},
  { path: 'about', component: AboutUs },

  { path: 'category/:categoryId', component: ProductCatalog },
  { path: 'product/:productId', component: ProductPanel },

  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us/about-us';
import { ProductPanel } from './product/product/product-panel'; 
import { ProductCatalog } from './product-catalog/product-catalog/product-catalog';

export const routes: Routes = [
  { path: '', component: AboutUs},
  { path: 'about', component: AboutUs },

  { path: 'category/:categoryId', component: ProductCatalog },
  { path: 'product/:productId', component: ProductPanel },

  { path: '**', redirectTo: '' }
];
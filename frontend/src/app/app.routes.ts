import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./client/account/account.routes').then((m) => m.ACCOUNT_ROUTES)
  },
  {
    path: '',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./homepage/homepage').then((m) => m.Homepage)
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./about-us/about-us/about-us').then((m) => m.AboutUs)
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./product-catalog/product-catalog').then((m) => m.ProductCatalog)
      },
      {
        path: 'product/:productId',
        loadComponent: () =>
          import('./product/product/product-panel').then((m) => m.ProductPanel)
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./checkout-page/checkout-page').then((m) => m.CheckoutPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
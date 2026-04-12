import { Routes } from '@angular/router';
import { AccountLayout } from './layout/account-layout';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/profile/profile').then((m) => m.ProfilePage)
      },
      {
        path: 'my-data',
        loadComponent: () =>
          import('./pages/my-data/my-data').then((m) => m.MyDataPage)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/order-history/order-history').then((m) => m.OrderHistoryPage)
      },
    ]
  }
];
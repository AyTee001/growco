import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AccountNavItem,
  AccountSidebar
} from '../../../shared/account-sidebar/account-sidebar';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterModule, AccountSidebar],
  templateUrl: './account-layout.html',
  styleUrl: './account-layout.scss'
})
export class AccountLayout {
  navItems: AccountNavItem[] = [
    {
      label: 'Профіль',
      icon: 'home',
      route: '/account'
    },
    {
      label: 'Мої дані',
      icon: 'person',
      route: '/account/my-data'
    },
    {
      label: 'Історія покупок',
      icon: 'history',
      route: '/account/orders'
    },
  ];
}
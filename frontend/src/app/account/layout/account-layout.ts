import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountSidebar, AccountNavItem } from '../../shared/account-sidebar/account-sidebar';
import { usersControllerGetProfile } from '../../client';
import { AuthService } from '../../core/auth.service';
import { UserContextService } from '../user.service';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterModule, AccountSidebar],
  templateUrl: './account-layout.html',
  styleUrl: './account-layout.scss',
})
export class AccountLayout implements OnInit {
  private userContext = inject(UserContextService);
  private authService = inject(AuthService);

  navItems: AccountNavItem[] = [
    { label: 'Профіль', icon: 'home', route: '/account' },
    { label: 'Мої дані', icon: 'person', route: '/account/my-data' },
    { label: 'Історія покупок', icon: 'history', route: '/account/orders' },
  ];

  async ngOnInit() {
    if (this.authService.isAuthenticated() && !this.userContext.user()) {
      this.userContext.isLoading.set(true);
      const { data, error } = await usersControllerGetProfile();
      if (data && !error) {
        this.userContext.setUser(data);
      }
      this.userContext.isLoading.set(false);
    }
  }
}
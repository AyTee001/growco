import { CommonModule } from '@angular/common';
import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { UserContextService } from '../../user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  public userContext = inject(UserContextService);

  readonly user = computed(() => this.userContext.user());
  readonly isLoading = computed(() => this.userContext.isLoading());
  readonly ordersCount = computed(() => this.userContext.orders().length);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userContext.refreshOrders();
    }
  }

  logout() {
    this.authService.logout();
  }
}
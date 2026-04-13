import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { usersControllerGetProfile } from '../../../client';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  user = {
    fullName: '',
    phone: ''
  };

  // Logic for the empty state
  ordersCount = 0; 

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private async loadUserProfile() {
    if (!this.authService.isAuthenticated()) {
      this.isLoading = false;
      return;
    }

    try {
      const { data, error } = await usersControllerGetProfile();
      if (data && !error) {
        this.user.fullName = data.name;
        this.user.phone = data.phoneNumber;
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  logout() {
    this.authService.logout();
  }
}
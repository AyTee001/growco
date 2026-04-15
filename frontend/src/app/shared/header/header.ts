import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MainMenu } from '../main-menu/main-menu';
import { Delivery } from '../delivery/delivery';
import { BasketService } from './basket/basket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private basketService = inject(BasketService);
  authService = inject(AuthService);

  searchQuery = signal<string>('');
  userName$ = this.authService.userName$;

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      this.searchQuery.set(params['q'] || '');
    });
  }

  openMenu() {
    this.dialog.open(MainMenu, {
      width: '100vw',
      maxWidth: '100vw',
      height: '75vh',
      position: { top: '0', left: '0' },
      panelClass: 'main-menu-75',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms'
    });
  }

  openDelivery() {
    this.dialog.open(Delivery, {
      width: '100vw',
      maxWidth: '100vw',
      height: '75vh',
      position: { top: '0', left: '0' },
      panelClass: 'delivery-dialog-75',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms'
    });
  }

  openBasket(): void {
    this.basketService.open();
  }

  onSearch(eventOrValue: any) {
    const query = typeof eventOrValue === 'string'
      ? eventOrValue
      : (eventOrValue.target as HTMLInputElement).value;

    if (query?.trim()) {
      this.router.navigate(['/catalog'], {
        queryParams: { q: query.trim() }
      });
    }
  }

  goToProfile(): void {
    this.router.navigate(['/account']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

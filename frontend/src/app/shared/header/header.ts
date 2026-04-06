import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MainMenu } from '../main-menu/main-menu';
import { Delivery } from '../delivery/delivery';
import { BasketService } from './basket/basket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private basketService = inject(BasketService);
  
  searchQuery = signal<string>('');

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
      position: {
        top: '0',
        left: '0'
      },
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
      position: {
        top: '0',
        left: '0'
      },
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
}


import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BasketService } from './basket.service';
import { BasketItem } from './basket-item/basket-item';
import { ConfirmDialog } from './confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketItem, RouterLink],
  templateUrl: './basket.html',
  styleUrls: ['./basket.scss']
})
export class Basket {
  public basketService = inject(BasketService);
  private dialog = inject(MatDialog);

  close(): void {
    this.basketService.close();
  }

  clear(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      autoFocus: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.basketService.clear();
      }
    });
  }
}
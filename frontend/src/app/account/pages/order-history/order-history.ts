import { Component, inject, OnInit } from '@angular/core';
import { UserContextService } from '../../user.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { Orders } from '../../../client';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
  imports: [CommonModule, MatExpansionModule, MatChipsModule]
})
export class OrderHistoryPage implements OnInit {
  public userContext = inject(UserContextService);

  ngOnInit() {
    this.userContext.refreshOrders();
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'warn';
      case 'COMPLETED': return 'primary';
      case 'CANCELLED': return 'accent';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'В обробці',
      'COMPLETED': 'Виконано',
      'CANCELLED': 'Скасовано'
    };
    return map[status.toUpperCase()] || status;
  }
}
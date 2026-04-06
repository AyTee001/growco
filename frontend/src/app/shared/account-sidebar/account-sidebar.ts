import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface AccountNavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-sidebar.html',
  styleUrl: './account-sidebar.scss'
})
export class AccountSidebar {
  @Input() items: AccountNavItem[] = [];
}
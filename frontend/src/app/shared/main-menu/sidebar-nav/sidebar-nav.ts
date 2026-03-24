import { Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../interfaces';

@Component({
  selector: 'app-sidebar-nav',
  imports: [MatListModule, MatIconModule],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
})
export class SidebarNav {
  menuData = input.required<Category[]>();
  activeId = input.required<number>();
  selectionChange = output<number>();
}

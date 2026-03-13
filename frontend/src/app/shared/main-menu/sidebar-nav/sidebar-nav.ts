import { Component, input, output } from '@angular/core';
import { MAIN_MENU_SCHEMA } from '../main-menu-schema';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar-nav',
  imports: [MatListModule, MatIconModule],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
})
export class SidebarNav {
  readonly menuData = MAIN_MENU_SCHEMA;
  activeId = input.required<string>();
  selectionChange = output<string>();
}

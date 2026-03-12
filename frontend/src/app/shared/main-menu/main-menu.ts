import { Component, computed, signal } from '@angular/core';
import { MAIN_MENU_SCHEMA } from './main-menu-schema';
import { SidebarNav } from "./sidebar-nav/sidebar-nav";
import { SubcategoryGrid } from "./subcategory-grid/subcategory-grid";

@Component({
  selector: 'app-main-menu',
  imports: [SidebarNav, SubcategoryGrid],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  selectedCategoryId = signal<string>('meat-products');

  activeCategory = computed(() =>
    MAIN_MENU_SCHEMA.find(c => c.id === this.selectedCategoryId())!
  );
}

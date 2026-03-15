import { Component, computed, signal, inject } from '@angular/core';
import { MAIN_MENU_SCHEMA } from './main-menu-schema';
import { SidebarNav } from "./sidebar-nav/sidebar-nav";
import { SubcategoryGrid } from "./subcategory-grid/subcategory-grid";
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-menu',
  imports: [SidebarNav, SubcategoryGrid, MatIconModule, MatButtonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  readonly selectedCategoryId = signal<string>('meat-products');
  private dialogRef = inject(MatDialogRef<MainMenu>);

  activeCategory = computed(() =>
    MAIN_MENU_SCHEMA.find(c => c.id === this.selectedCategoryId())! //Not sure how this schema info will propagate here in the end
  );

  readonly brands = signal([
    { id: '1', name: 'Наша ряба', logoFile: 'nasha_ryaba.png' },
    { id: '2', name: 'Київхліб', logoFile: 'kyivkhlib.png' },
    { id: '3', name: 'Галичина', logoFile: 'halychyna.png' },
    { id: '4', name: 'Яготинське', logoFile: 'yahotynske.png' },
    { id: '5', name: 'Світоч', logoFile: 'svitoch.png' },
  ]);

  closeMenu() {
    this.dialogRef.close();
  }
}

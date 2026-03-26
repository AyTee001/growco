import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { SidebarNav } from "./sidebar-nav/sidebar-nav";
import { SubcategoryGrid } from "./subcategory-grid/subcategory-grid";
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [SidebarNav, SubcategoryGrid, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  private dialogRef = inject(MatDialogRef<MainMenu>);
  private categoryService = inject(CategoryService);

  categoryTree = this.categoryService.categoryTree;

  readonly selectedCategoryId = signal<number>(1);

  activeCategory = computed(() =>
    this.categoryTree().find(c => c.categoryId === this.selectedCategoryId())!
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
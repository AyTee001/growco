import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { SidebarNav } from "./sidebar-nav/sidebar-nav";
import { SubcategoryGrid } from "./subcategory-grid/subcategory-grid";
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Category } from './interfaces';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [SidebarNav, SubcategoryGrid, MatIconModule, MatButtonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu implements OnInit {
  private dialogRef = inject(MatDialogRef<MainMenu>);
  private httpClient = inject(HttpClient);
  public categoryTree = signal<Category[]>([]);

  readonly selectedCategoryId = signal<number>(1);

  activeCategory = computed(() =>
    this.categoryTree().find(c => c.categoryId === this.selectedCategoryId())!
  );

  public ngOnInit(): void {
    this.httpClient.get<Category[]>('http://localhost:4200/api/categories')
      .pipe(
        map(data => this.buildTree(data))
      )
      .subscribe(tree => this.categoryTree.set(tree));
  }

  private buildTree(flatData: Category[]): Category[] {
    const roots = flatData.filter(item => item.parentCategoryId === null);

    return roots.map(parent => ({
      ...parent,
      subCategories: flatData.filter(child => child.parentCategoryId === parent.categoryId)
    }));
  }

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
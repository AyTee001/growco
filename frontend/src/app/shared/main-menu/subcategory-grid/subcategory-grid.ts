import { Component, inject, input, output } from '@angular/core';
import { Category } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subcategory-grid',
  imports: [],
  templateUrl: './subcategory-grid.html',
  styleUrl: './subcategory-grid.scss',
})
export class SubcategoryGrid {
  private router = inject(Router);
  readonly category = input.required<Category>();
  readonly closeMainMenu = output<void>();

  public subcategotyClicked(categoryId: number): void {
    this.router.navigate(['/catalog', categoryId]);
    this.closeMainMenu.emit();
  }
}

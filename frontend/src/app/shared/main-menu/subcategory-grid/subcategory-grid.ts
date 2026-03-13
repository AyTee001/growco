import { Component, input } from '@angular/core';

@Component({
  selector: 'app-subcategory-grid',
  imports: [],
  templateUrl: './subcategory-grid.html',
  styleUrl: './subcategory-grid.scss',
})
export class SubcategoryGrid {
  readonly category = input.required<Category>();
}

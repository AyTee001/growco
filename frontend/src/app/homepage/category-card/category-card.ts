import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss'
})
export class CategoryCard {
  readonly title = input<string>('Макарони');
  readonly image = input<string>('images/categories/pasta.svg');
  readonly alt = input<string>('Зображення категорії');
  readonly bgColor = input<string>('#EDEEE9');
}
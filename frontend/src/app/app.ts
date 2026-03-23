import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CategoryCard } from './homepage/category-card/category-card';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    CategoryCard,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}

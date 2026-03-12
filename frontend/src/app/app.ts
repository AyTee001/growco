import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}

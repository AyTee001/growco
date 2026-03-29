import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

export type SortValue = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sort-select',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './sort-select.html',
  styleUrls: ['./sort-select.scss']
})
export class SortSelectComponent {
  @Input() options: SortOption[] = [
    { value: 'price_asc', label: 'Найдешевші' },
    { value: 'price_desc', label: 'Найдорожчі' },
    { value: 'name_asc', label: 'Від А до Я' },
    { value: 'name_desc', label: 'Від Я до А' },
  ];
  @Input() selectedOption: string = 'price_asc';

  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string): void {
    this.sortChange.emit(value);
  }
}
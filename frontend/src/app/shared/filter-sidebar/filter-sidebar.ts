import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterCategory {
  categoryName: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule
  ],
  templateUrl: './filter-sidebar.html',
  styleUrls: ['./filter-sidebar.scss']
})
export class FilterSidebarComponent implements OnInit {
  @Input() config: FilterCategory[] = [];
  @Output() apply = new EventEmitter<any>();

  isOpen = false;
  filterForm!: FormGroup;
  expandedState: boolean[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.expandedState = this.config.map(() => true);
  }

  private buildForm(): void {
    const group: any = {};
    this.config.forEach(category => {
      if (category.type === 'checkbox') {
        const controls = category.options?.map(() => this.fb.control(false)) || [];
        group[category.categoryName] = this.fb.array(controls);
      } else if (category.type === 'radio') {
        group[category.categoryName] = this.fb.control(null);
      } else if (category.type === 'range') {
        group[category.categoryName] = this.fb.group({
          min: [category.min || 0],
          max: [category.max || 1000]
        });
      }
    });
    this.filterForm = this.fb.group(group);
  }

  toggleCategory(index: number): void {
    this.expandedState[index] = !this.expandedState[index];
  }

  getCheckboxArray(categoryName: string): FormArray {
    return this.filterForm.get(categoryName) as FormArray;
  }

  onApply(): void {
    const rawValue = this.filterForm.getRawValue();
    const result: any = {};
    this.config.forEach(category => {
      if (category.type === 'checkbox') {
        const selected: any[] = [];
        const formArray = this.filterForm.get(category.categoryName) as FormArray;
        category.options?.forEach((opt, idx) => {
          if (formArray.at(idx).value) {
            selected.push(opt.value);
          }
        });
        result[category.categoryName] = selected;
      } else if (category.type === 'radio') {
        result[category.categoryName] = this.filterForm.get(category.categoryName)?.value;
      } else if (category.type === 'range') {
        result[category.categoryName] = this.filterForm.get(category.categoryName)?.value;
      }
    });
    this.apply.emit(result);
    this.closePanel();
  }

  openPanel(): void {
    this.isOpen = true;
  }

  closePanel(): void {
    this.isOpen = false;
  }

  onBackdropClick(): void {
    this.closePanel();
  }
}
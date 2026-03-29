import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, input, effect, inject } from '@angular/core';
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
  key: string;
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
export class FilterSidebarComponent {
  private fb = inject(FormBuilder);
  readonly config = input.required<FilterCategory[]>();
  @Output() apply = new EventEmitter<any>();

  isOpen = false;
  filterForm: FormGroup = this.fb.group({}); 
  expandedState: boolean[] = [];

  constructor() {
    effect(() => {
      const currentConfig = this.config();
      this.buildForm(currentConfig);
      this.expandedState = currentConfig.map(() => true);
    });
  }

  private buildForm(configData: FilterCategory[]): void {
    const group: any = {};
    
    configData.forEach(category => {
      if (category.type === 'checkbox') {
        const controls = category.options?.map(() => this.fb.control(false)) || [];
        group[category.key] = this.fb.array(controls); // Use key here
      } else if (category.type === 'radio') {
        group[category.key] = this.fb.control(null);
      } else if (category.type === 'range') {
        group[category.key] = this.fb.group({
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
    const result: any = {};
    this.config().forEach(category => {
      const control = this.filterForm.get(category.key);
      if (category.type === 'checkbox') {
        const selected = category.options?.filter((_, idx) => (control as FormArray).at(idx).value).map(opt => opt.value);
        result[category.key] = selected;
      } else {
        result[category.key] = control?.value;
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
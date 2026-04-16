import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, input, effect, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

export type RangeFilterValue = { min: number | null; max: number | null };
export type CheckboxFilterValue = (string | number | boolean)[];
export type RadioFilterValue = string | number | boolean | null;

export interface FilterState {
  [categoryKey: string]: RangeFilterValue | CheckboxFilterValue | RadioFilterValue | undefined;
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
  readonly activeFilters = model<FilterState>({});
  @Output() apply = new EventEmitter<any>();

  isOpen = false;
  filterForm: FormGroup = this.fb.group({});
  expandedState: boolean[] = [];

  constructor() {
    effect(() => {
      const currentConfig = this.config();
      this.buildForm(currentConfig, this.activeFilters());
      this.expandedState = currentConfig.map(() => true);
    });
  }

  private buildForm(configData: FilterCategory[], savedState: FilterState): void {
    const group: any = {};

    configData.forEach(category => {
      const savedValue = savedState[category.key];

      if (category.type === 'checkbox') {
        const selectedValues = (savedValue as CheckboxFilterValue) || [];

        const controls = category.options?.map(opt => {
          const isChecked = selectedValues.includes(opt.value);
          return this.fb.control(isChecked);
        }) || [];

        group[category.key] = this.fb.array(controls);

      } else if (category.type === 'radio') {
        group[category.key] = this.fb.control(savedValue ?? null);

      } else if (category.type === 'range') {
        const rangeState = (savedValue as RangeFilterValue) || {};
        const absMin = category.min ?? 0;
        const absMax = category.max ?? 1000;

        group[category.key] = this.fb.group({
          min: [rangeState.min ?? absMin, [Validators.min(absMin), Validators.max(absMax)]],
          max: [rangeState.max ?? absMax, [Validators.min(absMin), Validators.max(absMax)]]
        }, { validators: this.rangeValidator });
      }
    });

    this.filterForm = this.fb.group(group);
  }

  private rangeValidator(group: AbstractControl): ValidationErrors | null {
    const min = group.get('min')?.value;
    const max = group.get('max')?.value;

    if (min !== null && max !== null && min > max) {
      return { rangeInvalid: true };
    }
    return null;
  }

  toggleCategory(index: number): void {
    this.expandedState[index] = !this.expandedState[index];
  }

  getCheckboxArray(categoryName: string): FormArray {
    return this.filterForm.get(categoryName) as FormArray;
  }

  onApply(): void {
    const result: FilterState = {};

    this.config().forEach(category => {
      const control = this.filterForm.get(category.key);

      if (category.type === 'checkbox') {
        const selected = category.options?.filter((_, idx) => (control as FormArray).at(idx).value).map(opt => opt.value);
        result[category.key] = selected as CheckboxFilterValue;
      } else {
        result[category.key] = control?.value;
      }
    });

    this.activeFilters.set(result);
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
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import {
  formatBirthDateYmd,
  isValidEmailOptional,
  isValidUaPhone,
  normalizeUaPhone,
  parseBirthDateYmd
} from './profile-field-validators';

export interface EditProfileFieldDialogData {
  title: string;
  fieldLabel: string;
  initialValue: string;
  mode: 'text' | 'tel' | 'email' | 'date' | 'gender';
}

@Component({
  selector: 'app-edit-profile-field-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="dialog-body">
      @if (data.mode === 'gender') {
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ data.fieldLabel }}</mat-label>
          <mat-select [(ngModel)]="value">
            <mat-option value="">Не вказано</mat-option>
            <mat-option value="Чоловік">Чоловік</mat-option>
            <mat-option value="Жінка">Жінка</mat-option>
            <mat-option value="Інше">Інше</mat-option>
          </mat-select>
        </mat-form-field>
      } @else if (data.mode === 'date') {
        <div class="date-block">
          <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic">
            <mat-label>{{ data.fieldLabel }}</mat-label>
            <input
              matInput
              [matDatepicker]="birthPicker"
              [(ngModel)]="birthDate"
              [max]="maxBirthDate"
              [min]="minBirthDate"
              placeholder="Оберіть дату"
              readonly
            />
            <mat-datepicker-toggle matIconSuffix [for]="birthPicker" />
            <mat-datepicker #birthPicker [startAt]="birthDate ?? maxBirthDate" />
            @if (dateRangeError) {
              <mat-error>{{ dateRangeError }}</mat-error>
            }
          </mat-form-field>
          <div class="date-footer">
            <p class="date-hint">Натисніть іконку календаря праворуч, щоб обрати дату.</p>
            <button type="button" mat-button color="primary" class="clear-date" (click)="clearBirthDate()">
              Очистити дату
            </button>
          </div>
        </div>
      } @else {
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ data.fieldLabel }}</mat-label>
          @switch (data.mode) {
            @case ('tel') {
              <input
                matInput
                type="tel"
                [(ngModel)]="value"
                (ngModelChange)="phoneTouched = true"
                autocomplete="tel"
                placeholder="+380 XX XXX XX XX або 0XX XXX XX XX"
              />
              @if (phoneTouched && phoneError) {
                <mat-error>{{ phoneError }}</mat-error>
              }
            }
            @case ('email') {
              <input
                matInput
                type="email"
                [(ngModel)]="value"
                (ngModelChange)="emailTouched = true"
                autocomplete="email"
                placeholder="name@example.com"
              />
              @if (emailTouched && emailError) {
                <mat-error>{{ emailError }}</mat-error>
              }
            }
            @default {
              <input matInput type="text" [(ngModel)]="value" />
            }
          }
        </mat-form-field>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Скасувати</button>
      <button mat-flat-button color="primary" type="button" (click)="save()">Зберегти</button>
    </mat-dialog-actions>
  `,
  styles: `
    :host .dialog-body {
      overflow: visible !important;
      padding-top: 20px;
      min-width: min(100vw - 48px, 320px);
      display: flex;
      flex-direction: column;
    }
    :host .full.mat-mdc-form-field {
      overflow: visible;
    }
    :host .full .mat-mdc-text-field-wrapper {
      overflow: visible;
    }
    .full {
      width: 100%;
    }
    mat-dialog-actions {
      padding-bottom: 16px;
      padding-right: 16px;
    }
    .date-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .date-footer {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      margin-top: 4px;
      padding-left: 2px;
    }
    .date-hint {
      margin: 0;
      font-size: 12px;
      line-height: 1.45;
      color: rgba(0, 0, 0, 0.6);
      max-width: 100%;
    }
    .clear-date {
      margin: 0;
      padding-left: 8px;
      padding-right: 8px;
      min-height: 36px;
    }
  `
})
export class EditProfileFieldDialog {
  readonly dialogRef = inject(MatDialogRef<EditProfileFieldDialog, string | undefined>);
  readonly data = inject<EditProfileFieldDialogData>(MAT_DIALOG_DATA);

  value = this.data.initialValue;
  birthDate: Date | null = parseBirthDateYmd(this.data.initialValue);

  readonly maxBirthDate = new Date();
  readonly minBirthDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120);
    return d;
  })();

  phoneTouched = false;
  emailTouched = false;

  get phoneError(): string | null {
    if (isValidUaPhone(this.value)) return null;
    return 'Вкажіть коректний номер: +380 та 9 цифр або 0XX XXX XX XX';
  }

  get emailError(): string | null {
    if (isValidEmailOptional(this.value)) return null;
    return 'Некоректна електронна адреса';
  }

  get dateRangeError(): string | null {
    if (!this.birthDate) return null;
    if (this.birthDate > this.maxBirthDate) return 'Дата не може бути в майбутньому';
    if (this.birthDate < this.minBirthDate) return 'Перевірте рік народження';
    return null;
  }

  clearBirthDate(): void {
    this.birthDate = null;
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  save(): void {
    if (this.data.mode === 'tel') {
      this.phoneTouched = true;
      if (this.phoneError) return;
      const normalized = normalizeUaPhone(this.value);
      this.dialogRef.close(normalized);
      return;
    }
    if (this.data.mode === 'email') {
      this.emailTouched = true;
      if (this.emailError) return;
      this.dialogRef.close(this.value.trim());
      return;
    }
    if (this.data.mode === 'date') {
      if (!this.birthDate) {
        this.dialogRef.close('');
        return;
      }
      if (this.dateRangeError) return;
      this.dialogRef.close(formatBirthDateYmd(this.birthDate));
      return;
    }
    this.dialogRef.close(this.value ?? '');
  }
}

import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserContextService } from '../../user.service';
import { usersControllerUpdateProfile } from '../../../client';
import { VALIDATION_PATTERNS } from '../../../core/validation.constants';

@Component({
  selector: 'app-my-data-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './my-data.html',
  styleUrl: './my-data.scss'
})
export class MyDataPage {
  private fb = inject(FormBuilder);
  private userContext = inject(UserContextService);
  private snackBar = inject(MatSnackBar);

  userForm = this.fb.group({
    name: ['', [
      Validators.required, 
      Validators.minLength(2),
      Validators.pattern(VALIDATION_PATTERNS.NAME)
    ]],
    phone: ['', [
      Validators.required,
      Validators.pattern(VALIDATION_PATTERNS.PHONE_UA)
    ]],
    email: [{ value: '', disabled: true }]
  });

  constructor() {
    effect(() => {
      const user = this.userContext.user();
      if (user && this.userForm.pristine) {
        this.userForm.patchValue({
          name: user.name,
          phone: user.phoneNumber,
          email: user.email
        }, { emitEvent: false });
      }
    });
  }

  async onSave() {
    if (this.userForm.invalid) return;

    const updatedData = {
      name: this.userForm.value.name!,
      phoneNumber: this.userForm.value.phone!
    };

    const { data, error } = await usersControllerUpdateProfile({ body: updatedData });

    if (!error && data) {
      this.userContext.setUser(data);
      this.userForm.markAsPristine();
      this.snackBar.open('Дані успішно оновлено', 'Закрити', { duration: 3000 });
    } else {
      this.snackBar.open('Помилка при оновленні', 'Закрити', { duration: 3000 });
    }
  }
}
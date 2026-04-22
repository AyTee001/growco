import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VALIDATION_PATTERNS } from '../../core/validation.constants';
import { NgxMaterialIntlTelInputComponent, TextLabels } from 'ngx-material-intl-tel-input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxMaterialIntlTelInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private cdr = inject(ChangeDetectorRef);

  phoneControl = new FormControl('');

  name = '';
  phoneNumber = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitted = false;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;
  patterns = VALIDATION_PATTERNS;

  textLabels: TextLabels = {
    mainLabel: 'Номер телефону',
    nationalNumberLabel: 'Номер',
    hintLabel: '',
    codePlaceholder: 'Код', 
    invalidNumberError: 'Некоректний номер',
    requiredError: 'Це поле обов’язкове',
    searchPlaceholderLabel: 'Пошук',
    noEntriesFoundLabel: 'Країну не знайдено'
  }

  ngOnInit() {
    this.phoneControl.valueChanges.subscribe(val => {
      this.phoneNumber = val || '';
    });
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid || this.phoneControl.invalid || this.password !== this.confirmPassword) {
      return;
    }

    this.loading = true;
    this.authService.register({
      name: this.name,
      phoneNumber: this.phoneControl.value!, // Get the clean E.164 string directly from the control
      email: this.email,
      password: this.password,
    }).subscribe({
        next: () => {
          const guestSessionId = this.cookieService.get('guest_cart_id');
          if (guestSessionId) {
            this.authService.mergeCart(guestSessionId).subscribe({
              next: () => {
                this.cookieService.delete('guest_cart_id', '/');
                this.router.navigate(['/']);
              },
              error: () => {
                this.router.navigate(['/']);
              },
            });
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Помилка реєстрації: перевірте дані, та переконайтеся, що на введеному e-mail ще немає акаунта';
          this.cdr.markForCheck();
        },
      });
  }
}
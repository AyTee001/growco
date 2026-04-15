import { Component, inject, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VALIDATION_PATTERNS } from '../../core/validation.constants';

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
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private cdr = inject(ChangeDetectorRef);

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

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = '';
    
    if (form.invalid || this.password !== this.confirmPassword) {
      return;
    }
    
    this.loading = true;
    this.authService
      .register({
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password,
      })
      .subscribe({
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
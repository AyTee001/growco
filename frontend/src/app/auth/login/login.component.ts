import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Added NgForm
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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  email = '';
  password = '';
  submitted = false;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  patterns = VALIDATION_PATTERNS;

  onSubmit(form: NgForm) { // Pass the form here
    this.submitted = true;
    this.errorMessage = '';
    
    // Rely on native form validity
    if (form.invalid) {
      return;
    }
    
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const guestSessionId = this.cookieService.get('guest_cart_id');
        if (guestSessionId) {
          this.authService.mergeCart(guestSessionId).subscribe({
            next: () => {
              this.cookieService.delete('guest_cart_id', '/');
              this.router.navigate(['/']);
            },
            error: () => this.router.navigate(['/']),
          });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Невірний email або пароль';
      },
    });
  }
}
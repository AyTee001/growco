import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (!this.email || !this.password) {
      return;
    }
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        let message = 'Невірний email або пароль';
        if (err.error?.message === 'Invalid credentials') {
          message = 'Невірний email або пароль';
        } else if (err.error?.message) {
          message = err.error.message;
        }
        this.errorMessage = message;
        this.cdr.detectChanges();
        console.error('Login error', err);
      }
    });
  }
}
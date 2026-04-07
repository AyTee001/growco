import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  phoneNumber = '';
  email = '';
  password = '';
  confirmPassword = '';
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
    if (!this.name || !this.phoneNumber || !this.email || !this.password || this.password !== this.confirmPassword) {
      return;
    }
    this.loading = true;
    this.authService.register({
      name: this.name,
      phoneNumber: this.phoneNumber,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        let message = 'Помилка реєстрації. Спробуйте пізніше.';
        if (err.error?.message === 'User already exists') {
          message = 'Користувач з таким email вже зареєстрований.';
        } else if (err.error?.message) {
          message = err.error.message;
        }
        this.errorMessage = message;
        this.cdr.detectChanges(); // Примусове оновлення
        console.error('Registration error', err);
      }
    });
  }
}
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Added NgForm
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
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
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  submitted = false;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  patterns = VALIDATION_PATTERNS;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
      }
    });
  }
}
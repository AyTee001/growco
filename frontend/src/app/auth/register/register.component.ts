import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
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
    MatIconModule
  ],
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
  hidePassword = true;
  hideConfirmPassword = true;
  patterns = VALIDATION_PATTERNS;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = '';
    
    if (form.invalid || this.password !== this.confirmPassword) {
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
        let message = 'Помилка реєстрації';
        if (err.error?.message === 'User already exists') {
          message = 'Користувач з таким email вже зареєстрований';
        } else if (err.error?.message) {
          message = err.error.message;
        }
        this.errorMessage = message;
        this.cdr.detectChanges();
      }
    });
  }
}
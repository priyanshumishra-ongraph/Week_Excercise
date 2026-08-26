import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Custom validator to check password strength (uppercase, lowercase, number, special char, min 12 chars)
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const errors: ValidationErrors = {};
  if (value.length < 12) errors['minlength'] = true;
  if (!/[A-Z]/.test(value)) errors['missingUppercase'] = true;
  if (!/[a-z]/.test(value)) errors['missingLowercase'] = true;
  if (!/[0-9]/.test(value)) errors['missingNumber'] = true;
  if (!/[^a-zA-Z0-9]/.test(value)) errors['missingSpecialChar'] = true;

  return Object.keys(errors).length > 0 ? errors : null;
}

// Custom validator to check if passwords match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // We only return a mismatch error if both fields exist, have values, and don't match.
  if (password && confirmPassword && password.value !== confirmPassword.value && confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div mat-card-avatar class="auth-avatar">
            <mat-icon>person_add</mat-icon>
          </div>
          <mat-card-title>Create an Account</mat-card-title>
          <mat-card-subtitle>Join TaskMaster today.</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
            
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput type="text" formControlName="username" placeholder="e.g. angular_ninja">
              <mat-error *ngIf="signupForm.get('username')?.hasError('required')">Username is required</mat-error>
              <mat-error *ngIf="signupForm.get('username')?.hasError('minlength')">Must be at least 3 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              <mat-error *ngIf="signupForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="signupForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Minimum 12 characters">
              <!-- Live Password Checklist underneath the input -->
              <div class="password-checklist">
                <div class="check-item" [class.met]="hasMinLength()">
                  <mat-icon class="check-icon">{{ hasMinLength() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                  At least 12 characters
                </div>
                <div class="check-item" [class.met]="hasUppercase()">
                  <mat-icon class="check-icon">{{ hasUppercase() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                  At least 1 uppercase letter (A-Z)
                </div>
                <div class="check-item" [class.met]="hasLowercase()">
                  <mat-icon class="check-icon">{{ hasLowercase() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                  At least 1 lowercase letter (a-z)
                </div>
                <div class="check-item" [class.met]="hasNumber()">
                  <mat-icon class="check-icon">{{ hasNumber() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                  At least 1 number (0-9)
                </div>
                <div class="check-item" [class.met]="hasSpecialChar()">
                  <mat-icon class="check-icon">{{ hasSpecialChar() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                  At least 1 special char (!&#64;#$%^&*)
                </div>
              </div>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your password">
              <mat-error *ngIf="signupForm.errors?.['passwordMismatch']">Passwords do not match!</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMsg }}</span>
            </div>

            <div *ngIf="submittedSuccessfully" class="success-banner">
              <mat-icon>check_circle</mat-icon>
              <span>Account created successfully! Redirecting to login...</span>
            </div>
            
            <button mat-flat-button color="accent" type="submit" [disabled]="signupForm.invalid" class="submit-btn">
              Sign Up Now
            </button>
            
          </form>
        </mat-card-content>
        
        <mat-card-footer>
          <p class="footer-text">
            Already have an account? <a routerLink="/login" color="primary">Log in</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 150px);
      background-color: #f8fafc;
      padding: 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 460px;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .auth-avatar {
      background-color: #fdf2f8;
      color: #611f69;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      margin-bottom: 1rem;
    }
    .auth-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    mat-card-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    mat-card-subtitle {
      font-size: 1rem;
      color: #64748b;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    mat-form-field {
      width: 100%;
    }
    .submit-btn {
      padding: 1.5rem 0;
      font-size: 1.1rem;
      margin-top: 1rem;
      border-radius: 8px;
      background-color: #007a5a !important;
      color: white !important;
    }
    .password-checklist {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .check-item {
      font-size: 0.8rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
    }
    .check-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .check-item.met {
      color: #007a5a;
      font-weight: 500;
    }
    .error-banner {
      background-color: #fef2f2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .success-banner {
      background-color: #ecfdf5;
      color: #007a5a;
      padding: 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .footer-text {
      text-align: center;
      margin-top: 1.5rem;
      color: #64748b;
    }
    .footer-text a {
      color: #007a5a;
      font-weight: 600;
      text-decoration: none;
    }
    .footer-text a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  
  submittedSuccessfully = false;
  errorMsg = '';

  // Initialize the Reactive Form
  signupForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator]],
    confirmPassword: ['']
  }, { validators: passwordMatchValidator });

  // Password requirement checkers for the checklist UI
  passwordVal(): string {
    return this.signupForm.get('password')?.value || '';
  }

  hasMinLength(): boolean {
    return this.passwordVal().length >= 12;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordVal());
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.passwordVal());
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.passwordVal());
  }

  hasSpecialChar(): boolean {
    return /[^a-zA-Z0-9]/.test(this.passwordVal());
  }

  // Helper method for template to check field validity cleanly
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.errorMsg = '';
      const { username, email, password } = this.signupForm.value;
      
      this.authService.register({ username, email, password }).subscribe({
        next: () => {
          this.submittedSuccessfully = true;
          this.signupForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMsg = err.error?.error || err.error?.message || 'Registration failed';
        }
      });
    } else {
      // Mark all fields as touched so errors display if they try to submit an empty form
      this.signupForm.markAllAsTouched();
    }
  }
}

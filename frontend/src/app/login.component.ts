import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
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
            <mat-icon>login</mat-icon>
          </div>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Log in to TaskMaster.</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            
            <mat-form-field appearance="outline">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Your password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMsg }}</span>
            </div>
            
            <button mat-flat-button color="primary" type="submit" [disabled]="loginForm.invalid" class="submit-btn">
              Log In
            </button>
            
          </form>
        </mat-card-content>
        
        <mat-card-footer>
          <p class="footer-text">
            Don't have an account? <a routerLink="/signup" color="accent">Sign up</a>
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
      max-width: 420px;
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
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  
  errorMsg = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMsg = '';
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/']); // Redirect to dashboard
        },
        error: (err) => {
          this.errorMsg = err.error?.error || err.error?.message || 'Invalid email or password';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Log in to TaskMaster.</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              [class.is-invalid]="isFieldInvalid('email')"
              placeholder="you@example.com"
            >
            @if (isFieldInvalid('email')) {
              <div class="error-msg">
                @if (loginForm.get('email')?.errors?.['required']) { <span>Email is required.</span> }
                @if (loginForm.get('email')?.errors?.['email']) { <span>Please enter a valid email.</span> }
              </div>
            }
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              [class.is-invalid]="isFieldInvalid('password')"
              placeholder="Your password"
            >
            @if (isFieldInvalid('password')) {
              <div class="error-msg">
                <span>Password is required.</span>
              </div>
            }
          </div>

          <button type="submit" class="btn-submit" [disabled]="loginForm.invalid">
            Log In
          </button>
          
          @if (errorMsg) {
            <div class="error-msg" style="text-align: center; margin-top: 1rem;">
              {{ errorMsg }}
            </div>
          }

          <p class="footer-text">
            Don't have an account? <a routerLink="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
    }
    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 480px;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #111827;
      font-size: 2rem;
      text-align: center;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 2.5rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    input:focus {
      border-color: #3b82f6;
    }
    input.is-invalid {
      border-color: #ef4444;
      background-color: #fef2f2;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      font-weight: 500;
    }
    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 1.125rem;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 1rem;
    }
    .btn-submit:hover:not(:disabled) {
      background: #2563eb;
    }
    .btn-submit:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      opacity: 0.7;
    }
    .footer-text {
      text-align: center;
      margin-top: 1.5rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .footer-text a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
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

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <h2>Create an Account</h2>
        <p class="subtitle">Join TaskMaster today.</p>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          
          <!-- Username Field -->
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username" 
              [class.is-invalid]="isFieldInvalid('username')"
              placeholder="e.g. angular_ninja"
            >
            @if (isFieldInvalid('username')) {
              <div class="error-msg">
                @if (signupForm.get('username')?.errors?.['required']) { <span>Username is required.</span> }
                @if (signupForm.get('username')?.errors?.['minlength']) { <span>Must be at least 3 characters.</span> }
              </div>
            }
          </div>

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
                @if (signupForm.get('email')?.errors?.['required']) { <span>Email is required.</span> }
                @if (signupForm.get('email')?.errors?.['email']) { <span>Please enter a valid email.</span> }
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
              placeholder="Minimum 12 characters"
            >
            
            <!-- Live Password Checklist -->
            <div class="password-checklist">
              <div class="check-item" [class.met]="hasMinLength()">
                <span class="icon">{{ hasMinLength() ? '✓' : '○' }}</span> At least 12 characters
              </div>
              <div class="check-item" [class.met]="hasUppercase()">
                <span class="icon">{{ hasUppercase() ? '✓' : '○' }}</span> At least 1 uppercase letter (A-Z)
              </div>
              <div class="check-item" [class.met]="hasLowercase()">
                <span class="icon">{{ hasLowercase() ? '✓' : '○' }}</span> At least 1 lowercase letter (a-z)
              </div>
              <div class="check-item" [class.met]="hasNumber()">
                <span class="icon">{{ hasNumber() ? '✓' : '○' }}</span> At least 1 number (0-9)
              </div>
              <div class="check-item" [class.met]="hasSpecialChar()">
                <span class="icon">{{ hasSpecialChar() ? '✓' : '○' }}</span> At least 1 special character (!&#64;#$%^&*)
              </div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              formControlName="confirmPassword" 
              [class.is-invalid]="signupForm.errors?.['passwordMismatch'] && signupForm.get('confirmPassword')?.touched"
              placeholder="Confirm your password"
            >
            @if (signupForm.errors?.['passwordMismatch'] && signupForm.get('confirmPassword')?.touched) {
              <div class="error-msg">
                <span>Passwords do not match!</span>
              </div>
            }
          </div>

          <button type="submit" class="btn-submit" [disabled]="signupForm.invalid">
            Sign Up Now
          </button>
          
          @if (submittedSuccessfully) {
            <div class="success-msg">
              Account created successfully! Welcome to the team.
            </div>
          }
        </form>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
    }
    .signup-card {
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
    .password-checklist {
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .check-item {
      font-size: 0.825rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
    }
    .check-item .icon {
      font-weight: bold;
      width: 14px;
    }
    .check-item.met {
      color: #10b981;
      font-weight: 600;
    }
    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: #10b981;
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
      background: #059669;
    }
    .btn-submit:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      opacity: 0.7;
    }
    .success-msg {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #d1fae5;
      color: #065f46;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
    }
  `]
})
export class SignupComponent {
  fb = inject(FormBuilder);
  
  submittedSuccessfully = false;

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
      console.log('Form Submitted!', this.signupForm.value);
      this.submittedSuccessfully = true;
      
      // Reset the form back to pristine state
      this.signupForm.reset();
      
      // Remove success message after 4 seconds
      setTimeout(() => {
        this.submittedSuccessfully = false;
      }, 4000);
    } else {
      // Mark all fields as touched so errors display if they try to submit an empty form
      this.signupForm.markAllAsTouched();
    }
  }
}

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <a routerLink="/" class="logo" aria-label="TaskMaster Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
        <span class="logo-text">TaskMaster</span>
      </a>
      
      <span class="spacer"></span>
      
      <nav class="nav-links">
        <a mat-button routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}" aria-label="Dashboard">Dashboard</a>
        <a mat-button routerLink="/users" routerLinkActive="active-link" aria-label="Team Directory">Directory</a>
        <a mat-button routerLink="/about" routerLinkActive="active-link" aria-label="About Us">About</a>
        
        @if (authService.currentUser()) {
          <span class="user-greeting">Hi, {{ authService.currentUser()?.name }}</span>
          <button mat-flat-button color="warn" (click)="authService.logout()" aria-label="Log Out" class="btn-signup">Log Out</button>
        } @else {
          <a mat-button routerLink="/login" routerLinkActive="active-link" aria-label="Log In">Log In</a>
          <a mat-flat-button color="accent" routerLink="/signup" aria-label="Sign Up" class="btn-signup">Sign Up</a>
        }
      </nav>
    </mat-toolbar>

    <main class="router-wrapper">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      background: #f1f5f9;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .navbar {
      padding: 0 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 800;
      color: white;
      text-decoration: none;
      letter-spacing: -0.025em;
    }
    .logo svg {
      color: #10b981;
    }
    .nav-links {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .active-link:not(.btn-signup) {
      background: rgba(255, 255, 255, 0.1);
    }
    .btn-signup {
      margin-left: 0.5rem;
    }
    .user-greeting {
      margin-left: 1rem;
      margin-right: 0.5rem;
      font-weight: 500;
    }
    .router-wrapper {
      padding: 2.5rem;
      max-width: 1600px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="navbar">
      <div class="nav-content">
        <a routerLink="/" class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
          TaskMaster
        </a>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/users" routerLinkActive="active">Directory</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/signup" routerLinkActive="active" class="btn-signup">Sign Up</a>
        </nav>
      </div>
    </header>

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
    .navbar {
      background: #1e3a8a;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .nav-content {
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      gap: 1.5rem;
    }
    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      padding: 0.5rem 0;
    }
    .nav-links a:hover {
      color: white;
    }
    .nav-links a.active:not(.btn-signup) {
      color: white;
      border-bottom: 2px solid white;
    }
    .btn-signup {
      background-color: #10b981;
      color: white !important;
      padding: 0.5rem 1rem !important;
      border-radius: 6px;
      font-weight: 600 !important;
      transition: background-color 0.2s;
    }
    .btn-signup:hover {
      background-color: #059669;
    }
    .router-wrapper {
      padding: 2.5rem;
      max-width: 1600px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {}

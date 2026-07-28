import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Oops! The page you are looking for seems to have gone missing.</p>
      <a routerLink="/" class="btn-home">Return to Dashboard</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 5rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      font-size: 8rem;
      margin: 0;
      color: #6366f1;
      line-height: 1;
      font-weight: 900;
    }
    h2 { font-size: 2rem; color: #1e293b; margin: 1rem 0; }
    p { color: #64748b; font-size: 1.125rem; margin-bottom: 2rem; }
    .btn-home {
      display: inline-block;
      padding: 1rem 2rem;
      background: #111827;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      transition: background 0.2s;
    }
    .btn-home:hover { background: #374151; }
  `]
})
export class NotFoundComponent {}

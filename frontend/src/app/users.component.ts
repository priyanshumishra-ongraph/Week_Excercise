import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, startWith } from 'rxjs';

// 1. Define Typed Data Interface
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
}

// Intermediary state interface to handle loading/error/data beautifully in template
interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h2>Team Directory</h2>
        <p>Live data fetched from JSONPlaceholder API</p>
        <button class="btn-refresh" (click)="refreshData()">Refresh Data</button>
      </div>

      <!-- Use the Async Pipe to handle the Observable automatically -->
      @if (usersState$ | async; as state) {
        
        <!-- Loading State -->
        @if (state.loading) {
          <div class="state-card loading">
            <div class="spinner"></div>
            <p>Fetching user data...</p>
          </div>
        }
        
        <!-- Error State -->
        @if (state.error) {
          <div class="state-card error">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <p>Oops! Failed to load data.</p>
            <span class="error-detail">{{ state.error }}</span>
          </div>
        }

        <!-- Data State -->
        @if (!state.loading && !state.error && state.data.length > 0) {
          <div class="users-grid">
            @for (user of state.data; track user.id) {
              <div class="user-card">
                <div class="card-top">
                  <div class="avatar">{{ user.name.charAt(0) }}</div>
                  <div class="user-info">
                    <h3>{{ user.name }}</h3>
                    <span class="username">&#64;{{ user.username }}</span>
                  </div>
                </div>
                
                <div class="contact">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {{ user.email }}
                </div>
                
                <div class="company">
                  <span class="company-label">Company</span>
                  <strong>{{ user.company.name }}</strong>
                  <span>"{{ user.company.catchPhrase }}"</span>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .users-container {
      width: 100%;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    .header-text {
      display: flex;
      flex-direction: column;
    }
    h2 {
      margin: 0;
      color: #111827;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .header p {
      margin: 0.5rem 0 0 0;
      color: #64748b;
      font-size: 1.125rem;
    }
    .btn-refresh {
      background: white;
      color: #1e3a8a;
      border: 2px solid #e5e7eb;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-refresh:hover {
      border-color: #1e3a8a;
      background: #f8fafc;
    }
    
    /* State Cards */
    .state-card {
      background: white;
      border-radius: 12px;
      padding: 6rem 2rem;
      text-align: center;
      border: 1px dashed #cbd5e1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .state-card p {
      font-size: 1.25rem;
      font-weight: 500;
      color: #475569;
      margin-top: 1.5rem;
    }
    
    /* Loading Spinner */
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f1f5f9;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    
    /* Error State */
    .error svg { color: #ef4444; }
    .error-detail {
      color: #ef4444;
      font-family: monospace;
      background: #fef2f2;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
    }

    /* Grid Layout */
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }
    .user-card {
      background: white;
      border-radius: 12px;
      padding: 1.75rem;
      border: 1px solid #f1f5f9;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
    }
    .user-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px -5px rgba(0,0,0,0.08);
      border-color: #e2e8f0;
    }
    
    .card-top {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .avatar {
      width: 50px;
      height: 50px;
      background: #f1f5f9;
      color: #334155;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-info h3 {
      margin: 0;
      color: #0f172a;
      font-size: 1.15rem;
      font-weight: 700;
    }
    .username {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: 0.1rem;
    }
    
    .contact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #475569;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .contact svg {
      color: #94a3b8;
    }
    
    .company {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .company-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      font-weight: 600;
    }
    .company strong {
      color: #1e293b;
      font-size: 0.95rem;
    }
    .company span {
      color: #64748b;
      font-style: italic;
      font-size: 0.85rem;
    }
  `]
})
export class UsersComponent {
  private http = inject(HttpClient);
  
  // Expose an Observable that the template subscribes to via the async pipe
  usersState$!: Observable<UserState>;

  constructor() {
    this.refreshData();
  }

  refreshData() {
    // 2. Fetch data and map it into a clean UI state object
    this.usersState$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      // Map success response
      map(users => ({ data: users, loading: false, error: null })),
      
      // Catch error and return a safe state object
      catchError(error => {
        return of({ 
          data: [], 
          loading: false, 
          error: error.message || 'Failed to fetch users' 
        });
      }),
      
      // Emit an initial loading state BEFORE the HTTP request completes
      startWith({ data: [], loading: true, error: null })
    );
  }
}

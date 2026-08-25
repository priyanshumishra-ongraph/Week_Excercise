import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, startWith, BehaviorSubject, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';

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
        <div class="header-text">
          <h2>Team Directory</h2>
        </div>
      
        <div class="header-actions">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search users..." 
              (input)="onSearch($event)"
              [value]="searchTerm$.value"
            >
          </div>
          <button class="btn-refresh" (click)="refreshData()">Refresh Data</button>
        </div>
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
                <div class="card-header-bg"></div>
                <div class="avatar">{{ user.name.charAt(0) }}</div>
                
                <div class="user-info">
                  <h3>{{ user.name }}</h3>
                  <span class="username">&#64;{{ user.username }}</span>
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
        <!-- Empty State -->
        @if (!state.loading && !state.error && state.data.length === 0) {
          <div class="state-card empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><circle cx="12" cy="12" r="10"/><path d="m16 16-4-4-4 4"/><path d="M12 8v.01"/></svg>
            <p>No team members found matching your search.</p>
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
      color: #611f69;
      border: 2px solid #e5e7eb;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-refresh:hover {
      border-color: #611f69;
      background: #fdf2f8;
      color: #611f69;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
    }
    .search-box input {
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      width: 250px;
      transition: border-color 0.2s;
    }
    .search-box input:focus {
      border-color: #611f69;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }
      .header-actions {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        width: 100%;
      }
      .search-box input {
        width: 100%;
        box-sizing: border-box;
      }
      .btn-refresh {
        width: 100%;
      }
      h2 {
        font-size: 2rem;
      }
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
      border-top-color: #611f69;
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .user-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      position: relative;
      border: 1px solid #e2e8f0;
      transition: transform 0.2s;
    }
    .user-card:hover {
      transform: translateY(-4px);
    }
    
    .card-header-bg {
      width: 100%;
      height: 70px;
      background: linear-gradient(135deg, #611f69, #a05c9a);
    }
    
    .avatar {
      width: 72px;
      height: 72px;
      background: #fdf2f8;
      border: 4px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #611f69;
      margin-top: -36px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      z-index: 1;
      font-size: 1.75rem;
      font-weight: 700;
    }
    
    .user-info {
      padding: 1.25rem 1.5rem 1.5rem 1.5rem;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f5f9;
    }
    .user-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      color: #0f172a;
      font-weight: 800;
    }
    .username {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
      display: block;
    }
    
    .contact {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #475569;
      font-size: 0.9rem;
      padding: 1.25rem;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f5f9;
    }
    .contact svg {
      color: #94a3b8;
    }
    
    .company {
      padding: 1.25rem 1.5rem 1.75rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.25rem;
      width: 100%;
      box-sizing: border-box;
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
  
  usersState$!: Observable<UserState>;
  searchTerm$ = new BehaviorSubject<string>('');

  constructor() {
    // Fetch all users once
    const allUsers$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      catchError(error => {
        console.error('Failed to fetch users', error);
        return of([]);
      })
    );

    // Combine search term with all users to filter client-side instantly
    this.usersState$ = this.searchTerm$.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(term => {
        return allUsers$.pipe(
          map(users => {
            if (!users || users.length === 0) {
              return { data: [], loading: false, error: 'Failed to fetch users' };
            }
            const lowerTerm = term.toLowerCase().trim();
            const filtered = lowerTerm 
              ? users.filter(u => 
                  u.name.toLowerCase().includes(lowerTerm) || 
                  u.username.toLowerCase().includes(lowerTerm) ||
                  u.email.toLowerCase().includes(lowerTerm) ||
                  u.company.name.toLowerCase().includes(lowerTerm)
                )
              : users;
            return { data: filtered, loading: false, error: null };
          }),
          startWith({ data: [], loading: true, error: null })
        );
      })
    );
  }

  refreshData() {
    // Just trigger a re-emission to show loading state temporarily and refresh
    const currentTerm = this.searchTerm$.value;
    this.searchTerm$.next('');
    setTimeout(() => this.searchTerm$.next(currentTerm), 50);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm$.next(target.value);
  }
}

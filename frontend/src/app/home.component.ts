import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { AuthService } from './core/auth.service';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  template: `
    <div class="app-layout">
      
      <!-- Top Welcome and KPI Row -->
      <div class="top-row">
        
        <div class="welcome-card">
          <div class="welcome-text">
            <h1>Welcome back, <span class="username">{{ authService.currentUser()?.name || 'User' }}</span>!</h1>
            <p>Here is your task summary for today.</p>
          </div>
        </div>

        <div class="kpi-cards">
          <!-- Total Tasks -->
          <div class="kpi-card">
            <div class="kpi-label">TOTAL TASKS</div>
            <div class="kpi-value text-purple">
              <span *ngIf="!todoService.isLoading()">{{ totalTasks() }}</span>
              <span *ngIf="todoService.isLoading()" class="kpi-skeleton"></span>
            </div>
          </div>
          
          <!-- To Do -->
          <div class="kpi-card">
            <div class="kpi-label">TO DO</div>
            <div class="kpi-value text-slate">
              <span *ngIf="!todoService.isLoading()">{{ todoTasks() }}</span>
              <span *ngIf="todoService.isLoading()" class="kpi-skeleton"></span>
            </div>
          </div>

          <!-- In Progress -->
          <div class="kpi-card">
            <div class="kpi-label">IN PROGRESS</div>
            <div class="kpi-value text-amber">
              <span *ngIf="!todoService.isLoading()">{{ inProgressTasks() }}</span>
              <span *ngIf="todoService.isLoading()" class="kpi-skeleton"></span>
            </div>
          </div>

          <!-- Done -->
          <div class="kpi-card">
            <div class="kpi-label">COMPLETED</div>
            <div class="kpi-value text-emerald">
              <span *ngIf="!todoService.isLoading()">{{ completedTasks() }}</span>
              <span *ngIf="todoService.isLoading()" class="kpi-skeleton"></span>
            </div>
          </div>
        </div>

      </div>

      <main class="main-content">
        <app-board></app-board>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    .top-row {
      display: flex;
      gap: 1.5rem;
      align-items: stretch;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
    }
    .welcome-card {
      background: linear-gradient(135deg, #611f69 0%, #4a154b 100%);
      color: white;
      padding: 2.5rem;
      border-radius: 16px;
      display: flex;
      flex: 1;
      min-width: 300px;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px rgba(97, 31, 105, 0.2);
    }
    .welcome-text h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 800;
    }
    .welcome-text .username {
      font-weight: 700;
      word-break: break-word;
    }
    .welcome-text p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }
    .kpi-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      flex: 2;
      min-width: 300px;
      box-sizing: border-box;
    }
    .kpi-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      border: 1px solid #f1f5f9;
      box-sizing: border-box;
    }
    .kpi-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .kpi-value {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kpi-skeleton {
      width: 40px;
      height: 40px;
      background: #e2e8f0;
      border-radius: 8px;
      animation: pulse 1.5s infinite ease-in-out;
    }
    @keyframes pulse {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
    .text-purple { color: #611f69; }
    .text-slate { color: #475569; }
    .text-amber { color: #f59e0b; }
    .text-emerald { color: #007a5a; }

    .main-content {
      width: 100%;
    }
    
    @media (max-width: 1200px) {
      .kpi-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .top-row {
        flex-direction: column;
      }
      .welcome-card {
        min-width: 100%;
        padding: 2rem;
      }
      .kpi-cards {
        min-width: 100%;
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 480px) {
      .kpi-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);
  todoService = inject(TodoService);

  totalTasks = computed(() => this.todoService.filteredTodos().length);
  
  todoTasks = computed(() => 
    this.todoService.filteredTodos().filter(t => t.progress_label === 'To Do' || (!t.completed && t.progress_label !== 'In Progress')).length
  );

  inProgressTasks = computed(() => 
    this.todoService.filteredTodos().filter(t => t.progress_label === 'In Progress').length
  );

  completedTasks = computed(() => 
    this.todoService.filteredTodos().filter(t => t.completed || t.progress_label === 'Done' || t.progress_label === 'Completed').length
  );
}

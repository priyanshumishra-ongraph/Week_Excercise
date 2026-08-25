import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TodoService, Todo } from './todo.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <a routerLink="/" class="back-link">&larr; Back to Dashboard</a>
      
      @if (task) {
        <div class="detail-card">
          <div class="detail-header">
            <h2>{{ task.title }}</h2>
            <span class="status-badge" [class.completed]="task.completed">
              {{ task.completed ? 'Completed' : 'In Progress' }}
            </span>
          </div>
          
          <div class="detail-body">
            @if (task.description) {
              <div class="info-group full-width-group">
                <label>Description</label>
                <p class="description-text">{{ task.description }}</p>
              </div>
            }

            <div class="info-group">
              <label>Priority</label>
              <p class="priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</p>
            </div>
            
            <div class="info-group">
              <label>Progress</label>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" [style.width]="task.progress_bar_fill + '%'"></div>
              </div>
              <p class="progress-text">{{ task.progress_stats }}</p>
            </div>
            
            <div class="info-group">
              <label>Assignees</label>
              <p>{{ task.assignee_names.join(', ') }}</p>
            </div>
            
            <div class="info-group">
              <label>Due Date</label>
              <p>{{ task.due_date | date:'fullDate' }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found">
          <h2>Task not found!</h2>
          <p>The task you are looking for does not exist or has been deleted.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 2rem;
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    .detail-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    h2 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
    }
    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      background: #fef3c7;
      color: #d97706;
      font-weight: bold;
      font-size: 0.875rem;
    }
    .status-badge.completed {
      background: #d1fae5;
      color: #059669;
    }
    .detail-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .info-group label {
      display: block;
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .full-width-group {
      grid-column: 1 / -1;
    }
    .description-text {
      white-space: pre-wrap;
      line-height: 1.5;
    }
    .info-group p {
      margin: 0;
      font-size: 1.125rem;
      color: #1f2937;
    }
    .priority {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      background-color: #f1f5f9;
      color: #475569;
    }
    .priority.low { background-color: #e2e8f0; color: #334155; }
    .priority.high { background-color: #fee2e2; color: #ef4444; }
    .priority.medium { background-color: #fef3c7; color: #d97706; }
    
    .progress-bar-bg { height: 8px; background-color: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-bar-fill { height: 100%; background-color: #10b981; border-radius: 4px; }
    .progress-text { font-size: 0.875rem !important; color: #6b7280 !important; }
    
    .not-found {
      text-align: center;
      padding: 4rem;
      background: white;
      border-radius: 12px;
      color: #ef4444;
    }
  `]
})
export class TaskDetailComponent {
  route = inject(ActivatedRoute);
  todoService = inject(TodoService);
  
  task: Todo | undefined;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.task = this.todoService.getTodoById(id);
    });
  }
}

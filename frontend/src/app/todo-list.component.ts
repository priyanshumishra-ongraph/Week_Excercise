import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from './todo.service';
import { TimeAgoPipe } from './shared/time-ago.pipe';
import { HighlightDirective } from './shared/highlight.directive';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TimeAgoPipe, 
    HighlightDirective,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  template: `
    <div class="todo-container">
      <div class="header-section">
        <h2>My Tasks</h2>
        
        <!-- Filter Buttons -->
        <div class="filters">
          <button mat-stroked-button [color]="todoService.filter() === 'all' ? 'primary' : ''" (click)="todoService.setFilter('all')" aria-label="Show all tasks">All</button>
          <button mat-stroked-button [color]="todoService.filter() === 'active' ? 'primary' : ''" (click)="todoService.setFilter('active')" aria-label="Show active tasks">Active</button>
          <button mat-stroked-button [color]="todoService.filter() === 'completed' ? 'primary' : ''" (click)="todoService.setFilter('completed')" aria-label="Show completed tasks">Completed</button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-group">
        <div class="input-fields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>What needs to be done?</mat-label>
            <input 
              matInput
              #todoInput 
              (keyup.enter)="descInput.focus()"
              aria-label="New task title"
            >
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optional)</mat-label>
            <input 
              matInput
              #descInput 
              (keyup.enter)="todoService.addTodo(todoInput.value, descInput.value); todoInput.value = ''; descInput.value = ''"
              aria-label="New task description"
            >
          </mat-form-field>
        </div>
        <button mat-flat-button color="primary" class="btn-add" (click)="todoService.addTodo(todoInput.value, descInput.value); todoInput.value = ''; descInput.value = ''" aria-label="Add new task">
          Add Task
        </button>
      </div>

      <!-- Todo List with @for and @empty -->
      <div class="task-grid">
        @for (task of todoService.filteredTodos(); track task.id) {
          <mat-card class="task-card" [class.completed]="task.completed" appHighlight="#f8fafc">
            <mat-card-header>
              <div class="card-title-row">
                <mat-checkbox 
                  [checked]="task.completed" 
                  (change)="todoService.toggleTodo(task.id)"
                  aria-label="Toggle task completion"
                ></mat-checkbox>
                
                @if (!task.isEditing) {
                  <h3 [class.strike]="task.completed">{{ task.title }}</h3>
                } @else {
                  <mat-form-field appearance="outline" class="inline-edit-field">
                    <mat-label>Edit Task</mat-label>
                    <input 
                      matInput
                      #editInput
                      [value]="task.title" 
                      (keyup.enter)="todoService.saveEdit(task.id, editInput.value)" 
                      (blur)="todoService.saveEdit(task.id, editInput.value)"
                      autofocus
                      aria-label="Edit task title"
                    >
                  </mat-form-field>
                }
              </div>
            </mat-card-header>
            
            <mat-card-content>
              <div class="header-actions">
                <a mat-icon-button color="primary" [routerLink]="['/task', task.id]" title="View Details" aria-label="View task details">
                  <mat-icon>visibility</mat-icon>
                </a>
                <button mat-icon-button color="accent" (click)="todoService.editTodo(task.id)" title="Edit Task" aria-label="Edit Task">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="todoService.deleteTodo(task.id)" title="Delete Task" aria-label="Delete Task">
                  <mat-icon>delete</mat-icon>
                </button>
                <span class="priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</span>
              </div>

              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">{{ task.progress_label }}</span>
                  <span class="progress-stats">{{ task.progress_stats }}</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" [style.width]="task.progress_bar_fill + '%'"></div>
                </div>
              </div>

              <div class="due-row">
                <div class="due-date">
                  <mat-icon inline="true" class="icon-small">event</mat-icon>
                  <span>{{ task.due_date | date:'MMM d' }}</span>
                </div>
                <div class="avatars">
                  @for (initials of task.assignee_initials_list; track initials) {
                    <div class="avatar" aria-label="Assignee Initials">{{ initials }}</div>
                  }
                </div>
              </div>
            </mat-card-content>

            <mat-divider></mat-divider>

            <mat-card-actions class="card-footer">
              <span class="created-date">{{ task.created_at ? (task.created_at | timeAgo) : 'N/A' }}</span>
              <div class="assignee">
                <span class="assignee-name">{{ task.assignee_names.join(', ') || 'Unknown User' }}</span>
              </div>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <p>Nothing to see here. Add a task or change the filter!</p>
          </div>
        }
      </div>
      
      <!-- Summary Footer -->
      <div class="todo-summary-footer">
        <span><strong>{{ todoService.remainingCount() }}</strong> items left</span>
        @if (todoService.todos().length > todoService.remainingCount()) {
          <button mat-button color="warn" (click)="todoService.clearCompleted()" aria-label="Clear completed tasks">Clear completed</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-container { width: 100%; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { margin: 0; color: #111827; font-size: 1.5rem; }
    .input-group { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: flex-start; }
    .input-fields { display: flex; flex-direction: column; flex: 1; gap: 0.5rem; }
    .full-width { flex: 1; width: 100%; }
    .btn-add { height: 56px; padding: 0 2rem; font-weight: bold; margin-top: 4px; }
    .filters { display: flex; gap: 0.5rem; }
    
    .task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .task-card { 
      padding: 0; 
      transition: transform 0.2s, box-shadow 0.2s; 
    }
    .task-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .task-card.completed { opacity: 0.6; }
    
    mat-card-header { padding: 16px 16px 0; }
    mat-card-content { padding: 0 16px 16px; }
    
    .card-title-row { display: flex; align-items: flex-start; gap: 12px; width: 100%; margin-bottom: 8px; }
    .card-title-row mat-checkbox { margin-top: -2px; }
    h3 { margin: 0; font-size: 1.15rem; color: #1e293b; font-weight: 500; line-height: 1.3; word-break: break-word; }
    h3.strike { text-decoration: line-through; color: #94a3b8; }
    .inline-edit-field { flex: 1; }
    
    .header-actions { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
    .priority { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background-color: #f1f5f9; color: #475569; white-space: nowrap; margin-left: auto; }
    .priority.low { background-color: #e2e8f0; color: #334155; }
    .priority.high { background-color: #fee2e2; color: #ef4444; }
    .priority.medium { background-color: #fef3c7; color: #d97706; }
    
    .progress-section { background-color: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; }
    .progress-label { font-weight: 600; color: #0f172a; }
    .progress-stats { color: #64748b; }
    .progress-bar-bg { height: 6px; background-color: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background-color: #10b981; border-radius: 3px; transition: width 0.3s ease; }
    
    .due-row { display: flex; justify-content: space-between; align-items: center; }
    .due-date { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: #64748b; }
    .icon-small { font-size: 16px; height: 16px; width: 16px; margin-bottom: 2px; }
    
    .avatars { display: flex; }
    .avatar { width: 24px; height: 24px; border-radius: 50%; background-color: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; border: 2px solid #ffffff; }
    .avatar:not(:first-child) { margin-left: -6px; }
    
    .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b; padding: 8px 16px; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #94a3b8; font-size: 1.125rem; background: white; border: 2px dashed #e2e8f0; border-radius: 12px; }
    .todo-summary-footer { display: flex; justify-content: space-between; align-items: center; color: #6b7280; font-size: 0.875rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
  `]
})
export class TodoListComponent {
  todoService = inject(TodoService);
}


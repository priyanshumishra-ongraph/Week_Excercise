import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="todo-container">
      <div class="header-section">
        <h2>My Tasks</h2>
        
        <!-- Filter Buttons -->
        <div class="filters">
          <button [class.active]="todoService.filter() === 'all'" (click)="todoService.setFilter('all')">All</button>
          <button [class.active]="todoService.filter() === 'active'" (click)="todoService.setFilter('active')">Active</button>
          <button [class.active]="todoService.filter() === 'completed'" (click)="todoService.setFilter('completed')">Completed</button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-group">
        <input 
          #todoInput 
          type="text" 
          placeholder="What needs to be done?" 
          (keyup.enter)="todoService.addTodo(todoInput.value); todoInput.value = ''"
        >
        <button class="btn-primary" (click)="todoService.addTodo(todoInput.value); todoInput.value = ''">
          Add Task
        </button>
      </div>

      <!-- Todo List with @for and @empty -->
      <div class="task-grid">
        @for (task of todoService.filteredTodos(); track task.id) {
          <div class="task-card" [class.completed]="task.completed">
            
            <div class="card-title-row">
              <div class="title-wrapper">
                <input 
                  type="checkbox" 
                  class="custom-checkbox"
                  [checked]="task.completed" 
                  (change)="todoService.toggleTodo(task.id)"
                >
                
                @if (!task.isEditing) {
                  <h3 [class.strike]="task.completed">{{ task.title }}</h3>
                } @else {
                  <input 
                    #editInput
                    type="text" 
                    class="inline-edit-input"
                    [value]="task.title" 
                    (keyup.enter)="todoService.saveEdit(task.id, editInput.value)" 
                    (blur)="todoService.saveEdit(task.id, editInput.value)"
                    autofocus
                  >
                }
              </div>
              <div class="header-actions">
                <a [routerLink]="['/task', task.id]" class="icon-btn view" title="View Details">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
                <button class="icon-btn edit" (click)="todoService.editTodo(task.id)" title="Edit Task">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button class="icon-btn delete" (click)="todoService.deleteTodo(task.id)" title="Delete Task">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
                <span class="priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</span>
              </div>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <span>{{ task.due_date | date:'MMM d' }}</span>
              </div>
              <div class="avatars">
                @for (initials of task.assignee_initials_list; track initials) {
                  <div class="avatar">{{ initials }}</div>
                }
              </div>
            </div>

            <hr class="divider">

            <div class="card-footer">
              <span class="created-date">{{ task.created_at || 'N/A' }}</span>
              <div class="assignee">
                <span class="assignee-name">{{ task.assignee_names.join(', ') || 'Unknown User' }}</span>
              </div>
            </div>
          </div>
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
          <button class="btn-clear" (click)="todoService.clearCompleted()">Clear completed</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-container { width: 100%; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { margin: 0; color: #111827; font-size: 1.5rem; }
    .input-group { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    input[type="text"] { flex: 1; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; outline: none; }
    input[type="text"]:focus { border-color: #6366f1; }
    .btn-primary { padding: 0 1.5rem; background-color: #10b981; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .filters { display: flex; gap: 0.5rem; }
    .filters button { padding: 0.5rem 1rem; background-color: white; border: 1px solid #e2e8f0; color: #4b5563; border-radius: 8px; cursor: pointer; font-weight: 500; }
    .filters button.active { background-color: #111827; color: white; border-color: #111827; }
    .task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .task-card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .task-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .task-card.completed { opacity: 0.6; }
    .card-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .title-wrapper { display: flex; align-items: flex-start; gap: 10px; flex: 1; }
    .custom-checkbox { margin-top: 2px; width: 1.25rem; height: 1.25rem; accent-color: #10b981; cursor: pointer; flex-shrink: 0; }
    .card-title-row h3 { margin: 0; font-size: 1.15rem; color: #1e293b; font-weight: 500; line-height: 1.3; word-break: break-word; }
    h3.strike { text-decoration: line-through; color: #94a3b8; }
    .inline-edit-input { flex: 1; padding: 0.25rem 0.5rem; font-size: 1.15rem; border: 2px solid #10b981; border-radius: 4px; outline: none; font-family: inherit; width: 100%; }
    .header-actions { display: flex; align-items: center; gap: 8px; }
    .icon-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; text-decoration: none; }
    .icon-btn:hover { background: #f1f5f9; }
    .icon-btn.view:hover { color: #8b5cf6; background: #f3e8ff; }
    .icon-btn.edit:hover { color: #3b82f6; background: #eff6ff; }
    .icon-btn.delete:hover { color: #ef4444; background: #fef2f2; }
    .priority { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background-color: #f1f5f9; color: #475569; white-space: nowrap; }
    .priority.low { background-color: #e2e8f0; color: #334155; }
    .priority.high { background-color: #fee2e2; color: #ef4444; }
    .priority.medium { background-color: #fef3c7; color: #d97706; }
    .progress-section { background-color: #ffffff; border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px solid #f1f5f9; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; }
    .progress-label { font-weight: 600; color: #0f172a; }
    .progress-stats { color: #64748b; }
    .progress-bar-bg { height: 6px; background-color: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background-color: #10b981; border-radius: 3px; transition: width 0.3s ease; }
    .due-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .due-date { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: #64748b; }
    .avatars { display: flex; }
    .avatar { width: 24px; height: 24px; border-radius: 50%; background-color: #8b5cf6; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; border: 2px solid #ffffff; }
    .avatar:not(:first-child) { margin-left: -6px; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 0 -16px 12px -16px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #94a3b8; font-size: 1.125rem; background: white; border: 2px dashed #e2e8f0; border-radius: 12px; }
    .todo-summary-footer { display: flex; justify-content: space-between; color: #6b7280; font-size: 0.875rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
    .btn-clear { background: transparent; border: none; color: #6b7280; cursor: pointer; }
    .btn-clear:hover { color: #111827; text-decoration: underline; }
  `]
})
export class TodoListComponent {
  todoService = inject(TodoService);
}


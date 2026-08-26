import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoService, Todo } from './todo.service';
import { TaskDialogComponent } from './task-dialog.component';
import { TimeAgoPipe } from './shared/time-ago.pipe';
import { HighlightDirective } from './shared/highlight.directive';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule, MatDialogModule, TimeAgoPipe, HighlightDirective],
  template: `
    <div class="board-header">
      <h2>{{ todoService.projectFilter() || 'Dashboard' }}</h2>
      <button mat-flat-button class="new-task-btn" (click)="openTaskDialog()">
        <mat-icon>add</mat-icon> New Task
      </button>
    </div>

    <!-- Error State -->
    <div class="state-container error-state" *ngIf="todoService.error()">
      <mat-icon>error_outline</mat-icon>
      <h3>Oops! Something went wrong</h3>
      <p>{{ todoService.error() }}</p>
      <button mat-stroked-button color="warn" (click)="todoService.loadTodos()">Try Again</button>
    </div>

    <!-- Loading State -->
    <div class="state-container loading-state" *ngIf="todoService.isLoading()">
      <div class="spinner"></div>
      <p>Loading your tasks...</p>
    </div>

    <!-- Empty State -->
    <div class="state-container empty-state" *ngIf="!todoService.isLoading() && !todoService.error() && todoService.filteredTodos().length === 0">
      <mat-icon>task</mat-icon>
      <h3>No tasks found</h3>
      <p>You don't have any tasks in this project yet.</p>
      <button mat-flat-button class="new-task-btn" style="margin-top: 1rem" (click)="openTaskDialog()">
        Create your first task
      </button>
    </div>

    <div class="board-container" *ngIf="!todoService.isLoading() && !todoService.error() && todoService.filteredTodos().length > 0">
      
      <!-- To Do Column -->
      <div class="column">
        <div class="column-header">
          <h3>To Do</h3>
          <span class="count">{{ todoTasks().length }}</span>
        </div>
        <div 
          class="task-list"
          cdkDropList
          #todoList="cdkDropList"
          [cdkDropListData]="todoTasks()"
          [cdkDropListConnectedTo]="[inProgressList, doneList]"
          (cdkDropListDropped)="drop($event, 'To Do')">
          
          <div class="task-card" appHighlight="#f1f5f9" [ngClass]="'priority-' + task.priority.toLowerCase()" *ngFor="let task of todoTasks()" cdkDrag (click)="openTaskDialog(task)">
            <div class="task-labels">
              <span class="task-priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</span>
              <span *ngIf="task.project && task.project !== 'General'" class="task-project">{{ task.project }}</span>
            </div>
            <h4>{{ task.title }}</h4>
            <p *ngIf="task.description" class="task-desc">{{ task.description }}</p>
            <div class="task-footer">
              <span class="assignee">{{ task.assignee_initials_list[0] }}</span>
              <span class="date"><mat-icon>schedule</mat-icon> Created {{ task.created_at | timeAgo }}</span>
            </div>
          </div>
          
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="column">
        <div class="column-header">
          <h3>In Progress</h3>
          <span class="count">{{ inProgressTasks().length }}</span>
        </div>
        <div 
          class="task-list"
          cdkDropList
          #inProgressList="cdkDropList"
          [cdkDropListData]="inProgressTasks()"
          [cdkDropListConnectedTo]="[todoList, doneList]"
          (cdkDropListDropped)="drop($event, 'In Progress')">
          
          <div class="task-card" appHighlight="#f1f5f9" [ngClass]="'priority-' + task.priority.toLowerCase()" *ngFor="let task of inProgressTasks()" cdkDrag (click)="openTaskDialog(task)">
            <div class="task-labels">
              <span class="task-priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</span>
              <span *ngIf="task.project && task.project !== 'General'" class="task-project">{{ task.project }}</span>
            </div>
            <h4>{{ task.title }}</h4>
            <p *ngIf="task.description" class="task-desc">{{ task.description }}</p>
            <div class="task-footer">
              <span class="assignee">{{ task.assignee_initials_list[0] }}</span>
              <span class="date"><mat-icon>schedule</mat-icon> Created {{ task.created_at | timeAgo }}</span>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Completed Column -->
      <div class="column">
        <div class="column-header">
          <h3>Completed</h3>
          <span class="count">{{ doneTasks().length }}</span>
        </div>
        <div 
          class="task-list"
          cdkDropList
          #doneList="cdkDropList"
          [cdkDropListData]="doneTasks()"
          [cdkDropListConnectedTo]="[todoList, inProgressList]"
          (cdkDropListDropped)="drop($event, 'Completed')">
          
          <div class="task-card done-card" appHighlight="#f1f5f9" [ngClass]="'priority-' + task.priority.toLowerCase()" *ngFor="let task of doneTasks()" cdkDrag (click)="openTaskDialog(task)">
            <div class="task-labels">
              <span class="task-priority" [ngClass]="task.priority.toLowerCase()">{{ task.priority }}</span>
              <span *ngIf="task.project && task.project !== 'General'" class="task-project">{{ task.project }}</span>
            </div>
            <h4>{{ task.title }}</h4>
            <p *ngIf="task.description" class="task-desc">{{ task.description }}</p>
            <div class="task-footer">
              <span class="assignee">{{ task.assignee_initials_list[0] }}</span>
              <span class="date"><mat-icon>check_circle</mat-icon> Completed {{ task.created_at | timeAgo }}</span>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  `,
  styles: [`
    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .board-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #1e293b;
    }
    .new-task-btn {
      background-color: #007a5a !important;
      color: white !important;
      font-weight: 600;
      border-radius: 4px;
    }
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px dashed #cbd5e1;
    }
    .state-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #94a3b8;
      margin-bottom: 1rem;
    }
    .state-container h3 {
      font-size: 1.25rem;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }
    .state-container p {
      color: #64748b;
      margin: 0 0 1.5rem 0;
    }
    .error-state mat-icon {
      color: #ef4444;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #611f69;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .board-container {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      min-height: 600px;
    }
    .column {
      flex: 1;
      min-width: 300px;
      background: #f1f5f9;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }
    .column-header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .column-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #475569;
    }
    .count {
      background: #e2e8f0;
      color: #64748b;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .task-list {
      padding: 1rem;
      flex-grow: 1;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .task-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .task-card:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .task-card h4 {
      margin: 0.5rem 0;
      color: #1e293b;
      font-size: 1rem;
    }
    .task-desc {
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .task-labels {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .task-priority, .task-project {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .task-card.priority-low { border-left: 4px solid #3b82f6; }
    .task-card.priority-medium { border-left: 4px solid #f59e0b; }
    .task-card.priority-high { border-left: 4px solid #ef4444; }
    
    .task-priority.low { background: #dbeafe; color: #1e40af; }
    .task-priority.medium { background: #fef3c7; color: #b45309; }
    .task-priority.high { background: #fee2e2; color: #b91c1c; }
    
    .task-project {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
    }
    
    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 0.5rem;
    }
    .assignee {
      background: #e2e8f0;
      color: #475569;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
    }
    .date {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #64748b;
    }
    .date mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .done-card {
      opacity: 0.7;
    }
    .done-card h4 {
      text-decoration: line-through;
    }
    
    /* Drag & Drop styles */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      background: white;
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .task-list.cdk-drop-list-dragging .task-card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class BoardComponent {
  todoService = inject(TodoService);
  dialog = inject(MatDialog);

  // Computed signals for columns
  todoTasks = computed(() => this.todoService.filteredTodos().filter(t => t.progress_label === 'To Do' || (!t.completed && t.progress_label !== 'In Progress')));
  inProgressTasks = computed(() => this.todoService.filteredTodos().filter(t => t.progress_label === 'In Progress'));
  doneTasks = computed(() => this.todoService.filteredTodos().filter(t => t.completed || t.progress_label === 'Done' || t.progress_label === 'Completed'));

  drop(event: CdkDragDrop<Todo[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      // Reordering within the same column (not persisted to backend yet, but UI handles it temporarily)
      // Note: Full persistence requires a sequence/order field in DB. We skip it for this scope.
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moved to a new column
      const task = event.previousContainer.data[event.previousIndex];
      // Note: We don't use transferArrayItem directly on signals. Instead we trigger the service update.
      this.todoService.updateTaskStatus(task.id, newStatus);
    }
  }

  openTaskDialog(task?: Todo) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'delete') {
          this.todoService.deleteTodo(result.id);
        } else if (task) {
          // Update existing
          this.todoService.saveEdit(task.id, result);
        } else {
          // Create new
          this.todoService.addTodo(result);
        }
      }
    });
  }
}

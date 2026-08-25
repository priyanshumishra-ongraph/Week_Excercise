import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Todo, TodoService } from './todo.service';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Task</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this task? This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Delete Task</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  template: `
    <h2 mat-dialog-title>{{ data.task ? 'Edit Task' : 'Create Task' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="taskForm" class="task-form">
        <mat-form-field appearance="outline">
          <mat-label>Task Title</mat-label>
          <input matInput formControlName="title" placeholder="What needs to be done?">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description (Optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Add more details..."></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Project</mat-label>
            <mat-select formControlName="project">
              <mat-option *ngFor="let proj of todoService.projects()" [value]="proj">{{ proj }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Low">Low</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="High">High</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="progress_label">
              <mat-option value="To Do">To Do</mat-option>
              <mat-option value="In Progress">In Progress</mat-option>
              <mat-option value="Completed">Completed</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Due Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="due_date" [min]="minDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button *ngIf="data.task" mat-button color="warn" (click)="onDelete()">Delete</button>
      <span style="flex: 1"></span>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button class="save-btn" [disabled]="taskForm.invalid" (click)="onSave()">
        {{ data.task ? 'Save Changes' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .task-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 0.5rem;
      min-width: 400px;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-row mat-form-field {
      flex: 1;
    }
    @media (max-width: 500px) {
      .task-form {
        min-width: 100%;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      ::ng-deep .mat-mdc-dialog-actions {
        flex-direction: column !important;
        align-items: stretch !important;
        padding-bottom: 24px !important;
      }
      ::ng-deep .mat-mdc-dialog-actions > button {
        width: 100%;
        margin: 0 0 8px 0 !important;
      }
      ::ng-deep .mat-mdc-dialog-actions > span {
        display: none;
      }
    }
    .save-btn {
      background-color: #007a5a !important;
      color: white !important;
      font-weight: 600;
      border-radius: 4px;
    }
  `]
})
export class TaskDialogComponent {
  fb = inject(FormBuilder);
  todoService = inject(TodoService);
  dialog = inject(MatDialog);
  
  minDate = new Date();

  taskForm = this.fb.group({
    title: [this.data?.task?.title || '', Validators.required],
    description: [this.data?.task?.description || ''],
    project: [this.data?.task?.project || 'General'],
    priority: [this.data?.task?.priority || 'Low'],
    progress_label: [this.data?.task?.progress_label || 'To Do'],
    due_date: [this.data?.task?.due_date ? new Date(this.data.task.due_date) : null]
  });

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Todo }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onDelete() {
    if (this.data.task) {
      const confirmRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '400px'
      });
      
      confirmRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close({ action: 'delete', id: this.data.task!.id });
        }
      });
    }
  }
}

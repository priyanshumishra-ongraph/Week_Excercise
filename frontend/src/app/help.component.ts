import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  template: `
    <div class="help-wrapper">
      <div class="help-header">
        <div class="icon-circle">
          <mat-icon>menu_book</mat-icon>
        </div>
        <h1>Help & Documentation</h1>
        <p>Learn how to get the most out of TaskMaster.</p>
      </div>

      <div class="faq-section">
        <mat-accordion multi>
          <mat-expansion-panel expanded>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="icon-box icon-purple"><mat-icon>add_task</mat-icon></div>
                <span>How do I create a new task?</span>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p>To create a new task, navigate to the <strong>All Tasks</strong> board and click the blue <strong>"New Task"</strong> button in the top right corner. A dialog will appear where you can enter the task title, description, select a project, set a priority, and choose its initial status.</p>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="icon-box icon-blue"><mat-icon>drag_indicator</mat-icon></div>
                <span>How do I move tasks across columns?</span>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p>TaskMaster features a fully interactive Kanban board. Simply click and hold any task card, drag it to the desired column (To Do, In Progress, or Completed), and release it. The task's progress and your dashboard KPIs will update automatically.</p>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="icon-box icon-green"><mat-icon>create_new_folder</mat-icon></div>
                <span>How do I add a new Project?</span>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p>In the left sidebar, click the <strong>"+"</strong> icon next to the "Projects" heading. You will be prompted to enter a new project name. Once created, the project will appear in your sidebar and will also be selectable from the dropdown when creating a new task.</p>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="icon-box icon-orange"><mat-icon>filter_alt</mat-icon></div>
                <span>How do I filter tasks by project?</span>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p>Click on any project name in the left sidebar. Your board and KPI counters will instantly filter to show only tasks belonging to that specific project. To view all tasks again, click "All Tasks" at the top of the sidebar.</p>
          </mat-expansion-panel>
          
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="icon-box icon-pink"><mat-icon>edit</mat-icon></div>
                <span>How do I edit or delete a task?</span>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p>Simply click on any task card on the board. The task details dialog will open, allowing you to edit any fields. If you wish to delete the task permanently, click the red <strong>Delete</strong> button in the bottom left corner of the dialog.</p>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
    </div>
  `,
  styles: [`
    .help-wrapper {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
      font-family: system-ui, -apple-system, sans-serif;
    }
    @media (max-width: 600px) {
      .help-wrapper {
        padding: 2rem 1rem;
      }
      .help-header h1 {
        font-size: 2rem;
      }
    }
    .help-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: #fdf2f8;
      border-radius: 50%;
      margin-bottom: 1.5rem;
    }
    .icon-circle mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #611f69;
    }
    .help-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 1rem 0;
      letter-spacing: -0.025em;
    }
    .help-header p {
      font-size: 1.15rem;
      color: #64748b;
      margin: 0;
    }
    .faq-section {
      background: transparent;
    }
    .mat-expansion-panel {
      box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
      border-radius: 12px !important;
      margin-bottom: 1rem !important;
    }
    ::ng-deep .mat-expansion-panel-header {
      height: auto !important;
      padding: 1rem 1.5rem !important;
      min-height: 64px !important;
    }
    ::ng-deep .mat-expansion-panel-header-title {
      white-space: normal !important;
      margin-right: 0 !important;
    }
    
    .icon-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    .icon-box mat-icon { font-size: 20px; width: 20px; height: 20px; }
    
    .icon-purple { background: #fdf2f8; color: #611f69; }
    .icon-blue { background: #eff6ff; color: #1164A3; }
    .icon-green { background: #ecfdf5; color: #007a5a; }
    .icon-orange { background: #fff7ed; color: #f97316; }
    .icon-pink { background: #fce7f3; color: #db2777; }
    
    mat-panel-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      line-height: 1.3;
    }
    p {
      color: #475569;
      line-height: 1.6;
      margin-top: 1rem;
    }
    strong {
      color: #0f172a;
    }
  `]
})
export class HelpComponent {}

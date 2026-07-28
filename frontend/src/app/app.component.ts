import { Component, signal } from '@angular/core';
import { StatDisplayComponent, ControlsComponent } from './stat-dashboard.component';
import { TodoListComponent } from './todo-list.component';
import { ProfileHeaderComponent, ProfileEditorComponent } from './profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StatDisplayComponent, 
    ControlsComponent, 
    TodoListComponent,
    ProfileHeaderComponent,
    ProfileEditorComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Sidebar / Left Column -->
      <aside class="sidebar">
        <!-- Profile Section -->
        <app-profile-header></app-profile-header>
        <app-profile-editor></app-profile-editor>

        <!-- Stats / Dashboard Section -->
        <div class="score-module">
          <app-stat-display [value]="score()"></app-stat-display>
          <app-controls 
            (onDecrease)="decreaseScore()" 
            (onIncrease)="increaseScore()">
          </app-controls>
        </div>
      </aside>

      <!-- Main Content / Right Column -->
      <main class="main-content">
        <app-todo-list></app-todo-list>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f1f5f9;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .app-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
      padding: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .app-layout {
        grid-template-columns: 1fr;
      }
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .score-module {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      text-align: center;
    }
    
    .main-content {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
    }
    
    /* Override internal component margins so they fit in the grid smoothly */
    ::ng-deep .todo-container {
      margin-top: 0 !important;
      max-width: 100% !important;
    }
  `]
})
export class AppComponent {
  score = signal(100);
  
  decreaseScore() {
    this.score.update(v => Math.max(0, v - 10));
  }
  
  increaseScore() {
    this.score.update(v => v + 10);
  }
}

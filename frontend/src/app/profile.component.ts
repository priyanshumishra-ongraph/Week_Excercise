import { Component, inject } from '@angular/core';
import { SharedStateService } from './shared-state.service';

// --- Sibling Component A: Profile Header ---
@Component({
  selector: 'app-profile-header',
  standalone: true,
  template: `
    <div class="header-card">
      <h2>Welcome back, <strong>{{ state.username() }}</strong>!</h2>
    </div>
  `,
  styles: [`
    .header-card { 
      background: #10b981; 
      color: white; 
      padding: 2rem; 
      border-radius: 12px; 
      text-align: center; 
    }
    h2 { 
      font-size: 1.75rem; 
      margin: 0; 
      font-weight: 400; 
    }
    h2 strong { 
      font-weight: 800; 
    }
  `]
})
export class ProfileHeaderComponent {
  state = inject(SharedStateService);
}

// --- Sibling Component B: Profile Editor ---
@Component({
  selector: 'app-profile-editor',
  standalone: true,
  template: `
    <div class="editor-card">
      <div class="input-group">
        <input 
          #nameInput 
          type="text" 
          [value]="state.username()" 
          (keyup.enter)="state.updateUsername(nameInput.value)"
          placeholder="Update your name..."
        >
        <button (click)="state.updateUsername(nameInput.value)">Save</button>
      </div>
    </div>
  `,
  styles: [`
    .editor-card { 
      background: white; 
      padding: 1.5rem; 
      border-radius: 12px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }
    .input-group { 
      display: flex; 
      gap: 0.5rem; 
    }
    input { 
      flex: 1; 
      padding: 0.75rem 1rem; 
      border: 2px solid #e2e8f0; 
      border-radius: 8px; 
      font-size: 1rem;
      outline: none;
    }
    input:focus {
      border-color: #10b981;
    }
    button { 
      background: #0f172a; 
      color: white; 
      border: none; 
      padding: 0 1.5rem; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: bold; 
      transition: background 0.2s;
    }
    button:hover { 
      background: #334155; 
    }
  `]
})
export class ProfileEditorComponent {
  state = inject(SharedStateService);
}

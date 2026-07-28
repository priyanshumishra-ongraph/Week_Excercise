import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-stat-display',
  standalone: true,
  template: `
    <div class="stat-box">
      <p class="label">Total Score</p>
      <h2>{{ value }}</h2>
    </div>
  `,
  styles: [`
    .stat-box {
      background: #f8fafc;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    .label { 
      color: #64748b; 
      font-size: 0.875rem; 
      text-transform: uppercase; 
      letter-spacing: 0.1em;
      margin: 0; 
      font-weight: 600;
    }
    h2 { 
      color: #3b82f6; 
      font-size: 4rem; 
      margin: 0.5rem 0 0 0; 
      line-height: 1; 
      font-weight: 800;
    }
  `]
})
export class StatDisplayComponent {
  @Input({ required: true }) value!: number;
}


@Component({
  selector: 'app-controls',
  standalone: true,
  template: `
    <div class="controls">
      <button class="btn-decrease" (click)="onDecrease.emit()">- Decrease</button>
      <button class="btn-increase" (click)="onIncrease.emit()">+ Increase</button>
    </div>
  `,
  styles: [`
    .controls { display: flex; gap: 1rem; justify-content: center; }
    button {
      flex: 1; 
      padding: 1rem; 
      border: none; 
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.2s ease;
    }
    button:active { transform: scale(0.95); }
    .btn-decrease { background: #e2e8f0; color: #475569; }
    .btn-decrease:hover { background: #cbd5e1; }
    .btn-increase { background: #3b82f6; color: white; }
    .btn-increase:hover { background: #2563eb; }
  `]
})
export class ControlsComponent {
  @Output() onDecrease = new EventEmitter<void>();
  @Output() onIncrease = new EventEmitter<void>();
}

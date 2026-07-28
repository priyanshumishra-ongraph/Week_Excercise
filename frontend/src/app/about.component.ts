import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-hero">
      <div class="hero-content">
        <h1 class="title">About TaskMaster</h1>
        
        <p class="description">
          It demonstrates Angular 17+ control flows, signals, reactive programming, 
          dependency injection, and modern routing features like parameterized and lazy-loaded routes.
        </p>
        <div class="tech-stack">
          <span class="badge angular">Angular 17</span>
          <span class="badge typescript">TypeScript</span>
          <span class="badge css">CSS Grid</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-hero { 
      min-height: calc(100vh - 180px); /* Subtract navbar and padding roughly */
      display: flex; 
      align-items: center; 
      justify-content: center;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      border-radius: 24px;
      margin: 0;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .hero-content {
      max-width: 800px;
      padding: 4rem 2rem;
      text-align: center;
      color: white;
    }
    .title { 
      font-size: 4rem; 
      font-weight: 900; 
      margin: 0 0 1rem 0; 
      color: white;
      text-shadow: 0 4px 12px rgba(0,0,0,0.15);
      line-height: 1.1;
    }
    .subtitle { 
      font-size: 1.5rem; 
      color: #e0f2fe; 
      font-weight: 500; 
      margin-bottom: 2rem; 
    }
    .description { 
      font-size: 1.25rem; 
      color: #bae6fd; 
      line-height: 1.7; 
      margin-bottom: 3rem; 
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .tech-stack { 
      display: flex; 
      justify-content: center; 
      flex-wrap: wrap;
      gap: 1rem; 
    }
    .badge { 
      padding: 0.75rem 2rem; 
      border-radius: 999px; 
      font-weight: bold; 
      font-size: 1rem; 
      color: white; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .angular { background: #dd0031; }
    .typescript { background: #3178c6; }
    .css { background: #1572b6; }
  `]
})
export class AboutComponent {}

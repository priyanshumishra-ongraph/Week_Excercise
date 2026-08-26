import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="about-wrapper">
      <div class="hero-section">
        <div class="logo-badge">
          <mat-icon>task_alt</mat-icon>
        </div>
        <h1 class="gradient-text">Capstone</h1>
        <p class="tagline">The modern way to organize, track, and accomplish your work.</p>
        <span class="version-badge">Version 2.0 (Beta)</span>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="f-icon blue"><mat-icon>dashboard</mat-icon></div>
          <h3>Kanban Board</h3>
          <p>Drag and drop tasks across customizable columns for visual workflow management.</p>
        </div>
        <div class="feature-card">
          <div class="f-icon green"><mat-icon>folder_special</mat-icon></div>
          <h3>Project Zones</h3>
          <p>Keep things organized by categorizing tasks into completely dynamic projects.</p>
        </div>
        <div class="feature-card">
          <div class="f-icon orange"><mat-icon>insert_chart_outlined</mat-icon></div>
          <h3>Real-time KPIs</h3>
          <p>Track your productivity with live-updating metrics and performance widgets.</p>
        </div>
        <div class="feature-card">
          <div class="f-icon purple"><mat-icon>security</mat-icon></div>
          <h3>Secure & Fast</h3>
          <p>Built with an enterprise-grade stack focusing on performance and security.</p>
        </div>
      </div>

      <div class="developer-section">
        <p class="section-title">DEVELOPED BY</p>
        <div class="dev-card">
          <div class="dev-card-header"></div>
          <div class="dev-avatar">
            <mat-icon>engineering</mat-icon>
          </div>
          <div class="dev-details">
            <h2>Priyanshu Mishra</h2>
            <p>MEAN Stack Developer</p>
            <span class="company-badge">OnGraph</span>
          </div>
        </div>
      </div>

      <div class="tech-stack">
        <p class="section-title">POWERED BY</p>
        <div class="badges">
          <span class="tech-badge">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" />
            MongoDB
          </span>
          <span class="tech-badge">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" alt="Express" />
            Express.js
          </span>
          <span class="tech-badge">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" alt="Angular" />
            Angular 17
          </span>
          <span class="tech-badge">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" />
            Node.js
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      margin: -2rem;
      padding: 2rem;
      box-sizing: border-box;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 10% 10%, hsla(228,100%,74%,0.15) 0px, transparent 50%),
        radial-gradient(at 90% 10%, hsla(189,100%,56%,0.15) 0px, transparent 50%),
        radial-gradient(at 50% 50%, hsla(355,100%,93%,0.4) 0px, transparent 50%);
    }
    .about-wrapper {
      max-width: 900px;
      margin: 0 auto;
      padding: 4rem 2rem;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .hero-section {
      text-align: center;
      margin-bottom: 5rem;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: #fdf2f8; /* light purple */
      border-radius: 20px;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(97, 31, 105, 0.2);
    }
    .logo-badge mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #611f69;
    }
    .gradient-text {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
      letter-spacing: -0.05em;
      background: linear-gradient(135deg, #611f69 0%, #350d36 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tagline {
      font-size: 1.25rem;
      color: #64748b;
      max-width: 500px;
      margin: 0 auto 2rem auto;
      line-height: 1.6;
    }
    .version-badge {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: #f1f5f9;
      color: #475569;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 5rem;
    }
    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .f-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .f-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .f-icon.blue { background: #eff6ff; color: #1164A3; }
    .f-icon.green { background: #ecfdf5; color: #007a5a; }
    .f-icon.orange { background: #fff7ed; color: #f97316; }
    .f-icon.purple { background: #fdf2f8; color: #611f69; }
    
    .feature-card h3 {
      font-size: 1.25rem;
      color: #0f172a;
      margin: 0 0 1rem 0;
      font-weight: 700;
    }
    .feature-card p {
      color: #64748b;
      line-height: 1.6;
      margin: 0;
      font-size: 0.95rem;
    }
    .tech-stack, .developer-section {
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 3rem;
      margin-bottom: 3rem;
    }
    .section-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
    }
    .dev-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
      overflow: hidden;
      width: 280px;
      position: relative;
      border: 1px solid #e2e8f0;
      transition: transform 0.2s;
    }
    .dev-card:hover {
      transform: translateY(-4px);
    }
    .dev-card-header {
      width: 100%;
      height: 70px;
      background: linear-gradient(135deg, #611f69, #a05c9a);
    }
    .dev-avatar {
      width: 72px;
      height: 72px;
      background: #fdf2f8;
      border: 4px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #611f69;
      margin-top: -36px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      z-index: 1;
    }
    .dev-avatar mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }
    .dev-details {
      padding: 1.25rem 1.5rem 1.75rem 1.5rem;
      text-align: center;
    }
    .dev-details h2 {
      margin: 0 0 0.25rem 0;
      font-size: 1.35rem;
      color: #0f172a;
      font-weight: 800;
    }
    .dev-details p {
      margin: 0 0 1rem 0;
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .company-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #10b981;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .badges {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }
    .tech-badge:hover {
      transform: translateY(-2px);
    }
    .tech-badge img {
      width: 24px;
      height: 24px;
    }
    
    @media (max-width: 768px) {
      .gradient-text { font-size: 2.5rem; }
      .features-grid { grid-template-columns: 1fr; }
      .about-wrapper { padding: 2rem 1.5rem; }
      .badges {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .tech-badge {
        width: 100%;
        box-sizing: border-box;
        justify-content: center;
        padding: 0.75rem 0.5rem;
      }
    }
  `]
})
export class AboutComponent {}

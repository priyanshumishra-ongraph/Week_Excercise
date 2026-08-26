import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './core/auth.service';
import { TodoService } from './todo.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Create New Project</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 8px;">
        <mat-label>Project Name</mat-label>
        <input matInput [(ngModel)]="projectName" placeholder="e.g. Marketing" (keyup.enter)="onSave()" autofocus>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!projectName.trim()" (click)="onSave()">Create</button>
    </mat-dialog-actions>
  `
})
export class AddProjectDialogComponent {
  projectName = '';
  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>) {}
  
  onSave() {
    if (this.projectName.trim()) {
      this.dialogRef.close(this.projectName.trim());
    }
  }
}

import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container" [class.is-authenticated]="authService.isLoggedIn()">
      
      @if (!isAuthPage) {
        <!-- Top Toolbar -->
        <mat-toolbar class="navbar">
          <div class="toolbar-left">
            <button mat-icon-button *ngIf="authService.isLoggedIn()" (click)="drawer.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            <a routerLink="/" class="logo" aria-label="TaskMaster Home">
              <mat-icon class="logo-icon">task_alt</mat-icon>
              <span class="logo-text">TaskMaster</span>
            </a>
          </div>
          
          <span class="spacer"></span>
          
          <nav class="nav-links">
            @if (authService.currentUser()) {
              <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
                <mat-icon>account_circle</mat-icon>
                <span>Hi, {{ authService.currentUser()?.name }}</span>
                <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
              </button>
              
              <mat-menu #userMenu="matMenu" xPosition="before" class="custom-user-menu">
                <div class="menu-header">
                  <p class="user-name">{{ authService.currentUser()?.name }}</p>
                  <p class="user-email">{{ authService.currentUser()?.email }}</p>
                </div>
                <mat-divider></mat-divider>
                <a mat-menu-item routerLink="/help">
                  <mat-icon>live_help</mat-icon>
                  <span>Help & Support</span>
                </a>
                <a mat-menu-item routerLink="/about">
                  <mat-icon>info</mat-icon>
                  <span>About</span>
                </a>
                <button mat-menu-item (click)="authService.logout()">
                  <mat-icon color="warn">logout</mat-icon>
                  <span style="color: #f44336">Log Out</span>
                </button>
              </mat-menu>
            } @else {
              <a mat-button routerLink="/login" routerLinkActive="active-link" aria-label="Log In">Log In</a>
              <a mat-flat-button color="accent" routerLink="/signup" aria-label="Sign Up">Sign Up</a>
            }
          </nav>
        </mat-toolbar>

        <!-- Main Layout with Sidenav -->
        <mat-sidenav-container class="sidenav-container">
          
          <mat-sidenav #drawer [mode]="'side'" [opened]="authService.isLoggedIn()" class="sidenav">
            <mat-nav-list>
              <div class="nav-section-title">Views</div>
              <a mat-list-item routerLink="/" [class.active-nav-item]="isAllTasksActive()" (click)="todoService.setProjectFilter(null); closeSidenavOnMobile(drawer)">
                <mat-icon matListItemIcon>view_kanban</mat-icon>
                <div matListItemTitle>Dashboard</div>
              </a>
              
              <a mat-list-item routerLink="/users" routerLinkActive="active-nav-item" (click)="closeSidenavOnMobile(drawer)">
                <mat-icon matListItemIcon>groups</mat-icon>
                <div matListItemTitle>Team</div>
              </a>
              
              <div class="nav-section-title" style="display: flex; justify-content: space-between; align-items: center; padding-right: 1rem;">
                <span>Projects</span>
                <button mat-icon-button (click)="promptAddProject()" style="width: 24px; height: 24px; line-height: 24px; padding: 0;" aria-label="Add Project">
                  <mat-icon style="font-size: 16px; width: 16px; height: 16px;">add</mat-icon>
                </button>
              </div>
              
              <div *ngFor="let proj of todoService.projects(); let i = index" 
                   class="project-list-item"
                   [class.active-nav-item]="isProjectActive(proj)">
                <div class="project-content" (click)="todoService.setProjectFilter(proj); closeSidenavOnMobile(drawer); router.navigate(['/'])">
                  <span class="color-dot-wrapper">
                    <span class="color-dot" [style.background]="getProjectColor(i)"></span>
                  </span>
                  <span class="project-title">{{ proj }}</span>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="projMenu" (click)="$event.stopPropagation()" class="proj-menu-btn" aria-label="Project Options">
                  <mat-icon style="font-size: 18px; width: 18px; height: 18px; line-height: 18px;">more_vert</mat-icon>
                </button>
                <mat-menu #projMenu="matMenu">
                  <button mat-menu-item (click)="deleteProject(proj)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span style="color: #f44336;">Delete Project</span>
                  </button>
                </mat-menu>
              </div>
            </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content class="main-content">
            <div class="router-wrapper">
              <router-outlet></router-outlet>
            </div>
          </mat-sidenav-content>

        </mat-sidenav-container>
      } @else {
        <!-- Auth Pages Layout (No Toolbar, No Sidebar) -->
        <main class="auth-wrapper">
          <router-outlet></router-outlet>
        </main>
      }
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .navbar {
      z-index: 1000;
      background-color: #350d36;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      position: relative;
    }
    .toolbar-left {
      display: flex;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.025em;
      margin-left: 0.5rem;
    }
    .logo-icon {
      color: #ffffff;
    }
    .nav-links {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .user-menu-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      border-radius: 4px;
      padding: 0 16px 0 12px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      transition: background 0.2s;
    }
    .user-menu-btn, .user-menu-btn .mdc-button__label, .user-menu-btn mat-icon {
      color: #ffffff !important;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .user-menu-btn:hover {
      background: rgba(255,255,255,0.2);
    }
    .user-menu-btn .dropdown-icon {
      margin-left: -4px;
    }
    @media (max-width: 600px) {
      .user-menu-btn span {
        display: none;
      }
      .user-menu-btn {
        padding: 0 8px;
      }
    }
    .menu-header {
      padding: 16px;
      outline: none;
    }
    .menu-header p {
      margin: 0;
    }
    .menu-header .user-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1rem;
    }
    .menu-header .user-email {
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 4px;
    }
    .sidenav-container {
      flex: 1;
      background: #f8fafc;
    }
    .sidenav {
      width: 260px;
      background: #611f69;
      border-right: none;
      color: #d1c2d3;
    }
    .sidenav mat-icon, .sidenav span, .sidenav div {
      color: #e2d8e4;
    }
    .sidenav a, .sidenav .mdc-list-item__primary-text, .sidenav .mat-mdc-list-item-title {
      color: #e2d8e4 !important;
      font-size: 0.95rem !important;
      font-weight: 500 !important;
    }
    .sidenav a:hover {
      background: rgba(255,255,255,0.08);
      color: #ffffff !important;
    }
    .nav-section-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
      color: #cbbbd0 !important;
      letter-spacing: 0.05em;
      padding: 1.5rem 1rem 0.5rem 1rem;
    }
    .nav-section-title span {
      color: #cbbbd0 !important;
    }
    .nav-section-title button mat-icon {
      color: #cbbbd0 !important;
    }
    .active-nav-item {
      background: rgba(255, 255, 255, 0.15) !important;
    }
    .active-nav-item, .active-nav-item span, .active-nav-item div, .active-nav-item .mdc-list-item__primary-text, .active-nav-item mat-icon {
      color: #ffffff !important;
    }
    .project-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px 0 16px;
      min-height: 48px;
      cursor: pointer;
      color: #e2d8e4;
      transition: background 0.15s;
    }
    .project-list-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .project-content {
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      height: 100%;
    }
    .color-dot-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      min-width: 24px;
      margin-right: 16px;
    }
    .color-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .project-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.95rem;
      font-weight: 500;
      color: inherit;
    }
    .proj-menu-btn {
      width: 28px; 
      height: 28px; 
      line-height: 28px; 
      padding: 0;
      opacity: 0.6;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    .proj-menu-btn:hover, .project-list-item:hover .proj-menu-btn {
      opacity: 1;
    }
    .main-content {
      display: flex;
      flex-direction: column;
    }
    .router-wrapper {
      padding: 2rem;
      flex: 1;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .auth-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }
    @media (max-width: 768px) {
      .router-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  todoService = inject(TodoService);
  router = inject(Router);
  dialog = inject(MatDialog);
  
  isAuthPage = false;
  currentUrl = signal(this.router.url);
  
  private projectColors = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
      this.isAuthPage = event.url.includes('/login') || event.url.includes('/signup');
    });
  }

  isDashboard(): boolean {
    const url = this.currentUrl();
    return url === '/' || url === '' || url.startsWith('/?');
  }

  isProjectActive(proj: string): boolean {
    return this.isDashboard() && this.todoService.projectFilter() === proj;
  }

  isAllTasksActive(): boolean {
    return this.isDashboard() && !this.todoService.projectFilter();
  }
  
  getProjectColor(index: number): string {
    return this.projectColors[index % this.projectColors.length];
  }
  
  promptAddProject() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.todoService.addProject(name);
        this.todoService.setProjectFilter(name);
      }
    });
  }

  deleteProject(name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete the project "${name}"? Tasks assigned to this project will still exist.` }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.todoService.deleteProject(name);
      }
    });
  }

  closeSidenavOnMobile(drawer: any) {
    if (window.innerWidth <= 768) {
      drawer.close();
    }
  }
}

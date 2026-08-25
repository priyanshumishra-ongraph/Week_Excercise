import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TaskDetailComponent } from './task-detail.component';
import { NotFoundComponent } from './not-found.component';
import { SignupComponent } from './signup.component';
import { LoginComponent } from './login.component';
import { UsersComponent } from './users.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard],
    title: 'Dashboard - TaskMaster'
  },
  { 
    path: 'task/:id', 
    component: TaskDetailComponent,
    canActivate: [authGuard],
    title: 'Task Details'
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [authGuard],
    title: 'Team Directory'
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about.component').then(m => m.AboutComponent),
    title: 'About TaskMaster'
  },
  { 
    path: 'help', 
    loadComponent: () => import('./help.component').then(m => m.HelpComponent),
    title: 'Help & Docs'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In'
  },
  { 
    path: '**', 
    component: NotFoundComponent,
    title: '404 - Not Found'
  }
];

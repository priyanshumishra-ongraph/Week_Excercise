import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TaskDetailComponent } from './task-detail.component';
import { NotFoundComponent } from './not-found.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Dashboard - TaskMaster'
  },
  { 
    path: 'task/:id', 
    component: TaskDetailComponent,
    title: 'Task Details'
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about.component').then(m => m.AboutComponent),
    title: 'About'
  },
  { 
    path: '**', 
    component: NotFoundComponent,
    title: '404 - Not Found'
  }
];

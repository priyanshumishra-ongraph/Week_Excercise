import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './core/auth.service';
import { environment } from '../environments/environment';

export interface Todo {
  id: string | number;
  title: string;
  description?: string;
  project?: string;
  completed: boolean;
  priority: string;
  progress_label: string;
  progress_stats: string;
  progress_bar_fill: number;
  due_date: Date | string;
  assignee_initials_list: string[];
  created_at: string;
  assignee_names: string[];
  isEditing?: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/tasks`;

  todos = signal<Todo[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  filter = signal<FilterType>('all');
  projectFilter = signal<string | null>(null);
  
  baseProjects = signal<string[]>(['General', 'Marketing', 'Engineering']);

  projects = computed(() => {
    const allTodos = this.todos();
    const base = this.baseProjects();
    const taskProjects = allTodos.map(t => t.project).filter(p => !!p) as string[];
    return Array.from(new Set([...base, ...taskProjects]));
  });

  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const currentProject = this.projectFilter();
    let allTodos = this.todos();
    
    if (currentProject) {
      allTodos = allTodos.filter(t => t.project === currentProject);
    }
    
    if (currentFilter === 'active') return allTodos.filter(t => !t.completed);
    if (currentFilter === 'completed') return allTodos.filter(t => t.completed);
    return allTodos;
  });

  remainingCount = computed(() => this.filteredTodos().filter(t => !t.completed).length);

  constructor() {
    effect(() => {
      // Whenever currentUser changes, if they are logged in, fetch their todos
      const user = this.authService.currentUser();
      if (user) {
        this.loadTodos();
        const storedProjects = localStorage.getItem(`projects_${user.id}`);
        if (storedProjects) {
          try {
            this.baseProjects.set(JSON.parse(storedProjects));
          } catch (e) {
            console.error('Failed to parse projects', e);
          }
        }
      } else {
        // Clear tasks on logout
        this.todos.set([]);
        this.baseProjects.set(['General', 'Marketing', 'Engineering']);
      }
    });
  }

  addProject(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    const current = this.baseProjects();
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed];
      this.baseProjects.set(updated);
      
      const user = this.authService.currentUser();
      if (user) {
        localStorage.setItem(`projects_${user.id}`, JSON.stringify(updated));
      }
    }
  }

  loadTodos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Ensure default UI fields exist if they were missing from the backend response
        const enrichedTodos = data.map(t => ({
          ...t,
          project: t.project || 'General',
          priority: t.priority || 'Medium',
          progress_label: t.progress_label || (t.completed ? 'Completion' : 'In Progress'),
          progress_stats: t.progress_stats || (t.completed ? '100%' : '0%'),
          progress_bar_fill: t.progress_bar_fill !== undefined ? t.progress_bar_fill : (t.completed ? 100 : 0),
          due_date: t.due_date ? new Date(t.due_date) : new Date(),
          assignee_initials_list: t.assignee_initials_list || ['U'],
          created_at: t.created_at || 'Just now',
          assignee_names: t.assignee_names || ['Unknown User'],
          isEditing: false
        }));
        this.todos.set(enrichedTodos);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.error.set('Failed to load tasks from server. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  addTodo(taskData: Partial<Todo>) {
    const newTodoPayload = {
      title: taskData.title?.trim() || 'Untitled Task',
      description: taskData.description?.trim() || '',
      project: taskData.project || 'General',
      priority: taskData.priority || 'Low',
      progress_label: taskData.progress_label || 'To Do',
      due_date: taskData.due_date || new Date(Date.now() + 86400000).toISOString(),
      assignee_initials_list: taskData.assignee_initials_list || ['PM'],
      created_at: taskData.created_at || new Date().toISOString(),
      assignee_names: taskData.assignee_names || ['Priyanshu Mishra']
    };

    this.http.post<Todo>(this.apiUrl, newTodoPayload).subscribe({
      next: (createdTask) => {
        const completeTask = { 
          ...newTodoPayload, 
          ...createdTask, 
          project: createdTask.project || newTodoPayload.project,
          due_date: createdTask.due_date || newTodoPayload.due_date,
          isEditing: false 
        };
        this.todos.update(t => [completeTask, ...t]);
      },
      error: (err) => console.error('Failed to add task', err)
    });
  }

  updateTaskStatus(id: string | number, newStatus: string) {
    const task = this.getTodoById(id);
    if (!task) return;

    let completed = false;
    let progress_bar_fill = 0;
    let progress_stats = '0%';

    if (newStatus === 'Done' || newStatus === 'Completed') {
      completed = true;
      progress_bar_fill = 100;
      progress_stats = '100%';
    } else if (newStatus === 'In Progress') {
      completed = false;
      progress_bar_fill = 50;
      progress_stats = '50%';
    } else {
      newStatus = 'To Do';
      completed = false;
      progress_bar_fill = 0;
      progress_stats = '0%';
    }

    const payload = {
      progress_label: newStatus,
      completed,
      progress_bar_fill,
      progress_stats
    };

    // Optimistic update
    this.todos.update(todos => todos.map(t => t.id === id ? { ...t, ...payload } : t));

    this.http.put<Todo>(`${this.apiUrl}/${id}`, payload).subscribe({
      error: (err) => {
        console.error('Failed to update task status', err);
        this.loadTodos(); // Revert on error
      }
    });
  }

  editTodo(id: string | number) {
    this.todos.update(todos => todos.map(t => t.id === id ? { ...t, isEditing: true } : t));
  }

  saveEdit(id: string | number, updatedFields: Partial<Todo>) {
    const existingTask = this.getTodoById(id);
    if (!existingTask) return;
    
    const completeUpdatedTask = { ...existingTask, ...updatedFields };

    this.http.put<Todo>(`${this.apiUrl}/${id}`, completeUpdatedTask).subscribe({
      next: (updatedTask) => {
        // Fallback to our local merged copy if backend dropped fields
        const finalTask = { ...completeUpdatedTask, ...updatedTask, isEditing: false };
        this.todos.update(todos => todos.map(t => t.id === id ? finalTask : t));
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  toggleTodo(id: string | number) {
    const task = this.getTodoById(id);
    if (!task) return;

    const isCompleted = !task.completed;
    const progress_label = isCompleted ? 'Completed' : 'To Do';
    this.updateTaskStatus(id, progress_label);
  }

  deleteTodo(id: string | number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }
  
  clearCompleted() {
    const completedTasks = this.todos().filter(t => t.completed);
    completedTasks.forEach(task => {
      this.deleteTodo(task.id);
    });
  }

  setFilter(newFilter: FilterType) {
    this.filter.set(newFilter);
  }

  setProjectFilter(project: string | null) {
    if (project !== null && this.projectFilter() === project) {
      this.projectFilter.set(null);
    } else {
      this.projectFilter.set(project);
    }
  }

  getTodoById(id: string | number): Todo | undefined {
    return this.todos().find(t => t.id === id);
  }
}

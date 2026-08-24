import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './core/auth.service';

export interface Todo {
  id: string | number;
  title: string;
  description?: string;
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
  private apiUrl = '/api/tasks';

  todos = signal<Todo[]>([]);
  filter = signal<FilterType>('all');

  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    if (currentFilter === 'active') return allTodos.filter(t => !t.completed);
    if (currentFilter === 'completed') return allTodos.filter(t => t.completed);
    return allTodos;
  });

  remainingCount = computed(() => this.todos().filter(t => !t.completed).length);

  constructor() {
    effect(() => {
      // Whenever currentUser changes, if they are logged in, fetch their todos
      if (this.authService.currentUser()) {
        this.loadTodos();
      } else {
        // Clear tasks on logout
        this.todos.set([]);
      }
    });
  }

  loadTodos() {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Ensure default UI fields exist if they were missing from the backend response
        const enrichedTodos = data.map(t => ({
          ...t,
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
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  addTodo(text: string, description: string = '') {
    if (!text.trim()) return;
    
    const newTodoPayload = {
      title: text.trim(),
      description: description.trim(),
      priority: 'Low',
      progress_label: 'New Task',
      progress_stats: '0%',
      progress_bar_fill: 0,
      due_date: new Date(Date.now() + 86400000).toISOString(),
      assignee_initials_list: ['PM'],
      created_at: 'Just now',
      assignee_names: ['Priyanshu Mishra']
    };

    this.http.post<Todo>(this.apiUrl, newTodoPayload).subscribe({
      next: (createdTask) => {
        this.todos.update(t => [{...createdTask, isEditing: false}, ...t]);
      },
      error: (err) => console.error('Failed to add task', err)
    });
  }

  editTodo(id: string | number) {
    this.todos.update(todos => todos.map(t => t.id === id ? { ...t, isEditing: true } : t));
  }

  saveEdit(id: string | number, newTitle: string) {
    const updatedTitle = newTitle.trim();
    if (!updatedTitle) {
      this.todos.update(todos => todos.map(t => t.id === id ? { ...t, isEditing: false } : t));
      return;
    }

    this.http.put<Todo>(`${this.apiUrl}/${id}`, { title: updatedTitle }).subscribe({
      next: (updatedTask) => {
        this.todos.update(todos => todos.map(t => t.id === id ? { ...t, ...updatedTask, isEditing: false } : t));
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  toggleTodo(id: string | number) {
    const task = this.getTodoById(id);
    if (!task) return;

    const isCompleted = !task.completed;
    const progress_stats = isCompleted ? '100%' : (task.progress_bar_fill === 0 ? '0%' : '50%');
    const progress_bar_fill = isCompleted ? 100 : (task.progress_bar_fill === 100 ? 50 : task.progress_bar_fill);

    this.http.put<Todo>(`${this.apiUrl}/${id}`, { 
      completed: isCompleted,
      progress_stats,
      progress_bar_fill
    }).subscribe({
      next: (updatedTask) => {
        this.todos.update(todos => todos.map(t => t.id === id ? { ...t, ...updatedTask } : t));
      },
      error: (err) => console.error('Failed to toggle task', err)
    });
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

  getTodoById(id: string | number): Todo | undefined {
    return this.todos().find(t => t.id === id);
  }
}

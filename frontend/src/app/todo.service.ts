import { Injectable, signal, computed } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  progress_label: string;
  progress_stats: string;
  progress_bar_fill: number;
  due_date: Date;
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
  todos = signal<Todo[]>([
    { 
      id: 1, 
      title: 'Learn Angular Control Flow', 
      completed: true,
      priority: 'High',
      progress_label: 'Completion',
      progress_stats: '100%',
      progress_bar_fill: 100,
      due_date: new Date(),
      assignee_initials_list: ['PM'],
      created_at: 'Today',
      assignee_names: ['Priyanshu Mishra'],
      isEditing: false
    },
    { 
      id: 2, 
      title: 'Master @for and track', 
      completed: false,
      priority: 'Medium',
      progress_label: 'Completion',
      progress_stats: '45%',
      progress_bar_fill: 45,
      due_date: new Date(),
      assignee_initials_list: ['PM', 'AI'],
      created_at: 'Today',
      assignee_names: ['Priyanshu Mishra'],
      isEditing: false
    },
  ]);

  filter = signal<FilterType>('all');

  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    if (currentFilter === 'active') return allTodos.filter(t => !t.completed);
    if (currentFilter === 'completed') return allTodos.filter(t => t.completed);
    return allTodos;
  });

  remainingCount = computed(() => this.todos().filter(t => !t.completed).length);

  addTodo(text: string) {
    if (!text.trim()) return;
    const newTodo: Todo = { 
      id: Date.now(), 
      title: text.trim(), 
      completed: false,
      priority: 'Low',
      progress_label: 'New Task',
      progress_stats: '0%',
      progress_bar_fill: 0,
      due_date: new Date(Date.now() + 86400000),
      assignee_initials_list: ['PM'],
      created_at: 'Just now',
      assignee_names: ['Priyanshu Mishra'],
      isEditing: false
    };
    this.todos.update(t => [newTodo, ...t]);
  }

  editTodo(id: number) {
    this.todos.update(todos => todos.map(t => t.id === id ? { ...t, isEditing: true } : t));
  }

  saveEdit(id: number, newTitle: string) {
    this.todos.update(todos => todos.map(t => {
      if (t.id === id) {
        const updatedTitle = newTitle.trim() || t.title;
        return { ...t, title: updatedTitle, isEditing: false };
      }
      return t;
    }));
  }

  toggleTodo(id: number) {
    this.todos.update(todos => 
      todos.map(t => {
        if (t.id === id) {
          const isCompleted = !t.completed;
          return {
            ...t,
            completed: isCompleted,
            progress_stats: isCompleted ? '100%' : (t.progress_bar_fill === 0 ? '0%' : '50%'),
            progress_bar_fill: isCompleted ? 100 : (t.progress_bar_fill === 100 ? 50 : t.progress_bar_fill),
          };
        }
        return t;
      })
    );
  }

  deleteTodo(id: number) {
    this.todos.update(todos => todos.filter(t => t.id !== id));
  }
  
  clearCompleted() {
    this.todos.update(todos => todos.filter(t => !t.completed));
  }

  setFilter(newFilter: FilterType) {
    this.filter.set(newFilter);
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos().find(t => t.id === id);
  }
}

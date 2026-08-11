import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { type Task, tasks } from '../models/task.model.js';

export const createTask = (req: Request, res: Response) => {
  const { title, priority, progress_label, progress_stats, progress_bar_fill, due_date, assignee_initials_list, created_at, assignee_names } = req.body;

  const newTask: Task = {
    id: randomUUID(),
    title,
    completed: false,
    priority: priority || 'Low',
    progress_label: progress_label || 'New Task',
    progress_stats: progress_stats || '0%',
    progress_bar_fill: progress_bar_fill || 0,
    due_date: due_date || new Date().toISOString(),
    assignee_initials_list: assignee_initials_list || ['U'],
    created_at: created_at || new Date().toISOString(),
    assignee_names: assignee_names || ['Unknown User']
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const getTasks = (req: Request, res: Response) => {
  let result = tasks;
  
  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === 'true';
    result = result.filter(t => t.completed === isCompleted);
  }
  
  res.status(200).json(result);
};

export const getTaskById = (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(task);
};

export const updateTask = (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed, priority, progress_label, progress_stats, progress_bar_fill, due_date, assignee_initials_list, created_at, assignee_names } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;
  if (progress_label !== undefined) task.progress_label = progress_label;
  if (progress_stats !== undefined) task.progress_stats = progress_stats;
  if (progress_bar_fill !== undefined) task.progress_bar_fill = progress_bar_fill;
  if (due_date !== undefined) task.due_date = due_date;
  if (assignee_initials_list !== undefined) task.assignee_initials_list = assignee_initials_list;
  if (created_at !== undefined) task.created_at = created_at;
  if (assignee_names !== undefined) task.assignee_names = assignee_names;

  res.status(200).json(task);
};

export const deleteTask = (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
};

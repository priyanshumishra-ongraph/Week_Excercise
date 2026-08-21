import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().trim().optional(),
  priority: z.string().optional(),
  progress_label: z.string().optional(),
  progress_stats: z.string().optional(),
  progress_bar_fill: z.number().min(0).max(100).optional(),
  due_date: z.string().datetime().optional().or(z.string().optional()), // Frontend might send just a date string that isn't strict ISO datetime
  assignee_initials_list: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  assignee_names: z.array(z.string()).optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim().optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional(),
  priority: z.string().optional(),
  progress_label: z.string().optional(),
  progress_stats: z.string().optional(),
  progress_bar_fill: z.number().min(0).max(100).optional(),
  due_date: z.string().datetime().optional().or(z.string().optional()),
  assignee_initials_list: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  assignee_names: z.array(z.string()).optional()
});

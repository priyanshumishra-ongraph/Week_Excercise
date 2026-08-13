import type { Request, Response } from 'express';
import { Task } from '../models/task.model.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, priority, progress_label, progress_stats, progress_bar_fill, due_date, assignee_initials_list, created_at, assignee_names } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const newTask = await Task.create({
      title,
      priority,
      progress_label,
      progress_stats,
      progress_bar_fill,
      due_date,
      assignee_initials_list,
      created_at,
      assignee_names,
      user: req.user.id
    });
    
    await newTask.populate('user', 'username email');

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const filter: any = { user: req.user.id };
    
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }
    
    const tasks = await Task.find(filter).populate('user', 'username email');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id }).populate('user', 'username email');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

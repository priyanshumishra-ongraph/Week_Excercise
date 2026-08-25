import type { Request, Response, NextFunction } from 'express';
import { Task } from '../models/task.model.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const getTaskId = (req: AuthRequest): string | null => {
  const taskId = req.params.id;

  if (typeof taskId !== 'string' || taskId.trim().length === 0) {
    return null;
  }

  return taskId;
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, project, priority, progress_label, due_date, assignee_initials_list, created_at, assignee_names } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      project,
      priority,
      progress_label,
      due_date,
      assignee_initials_list,
      created_at,
      assignee_names,
      user: req.user.id
    });
    
    await newTask.populate('user', 'username email');

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const taskId = getTaskId(req);

  if (!taskId) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.id }).populate('user', 'username email');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const taskId = getTaskId(req);

  if (!taskId) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).where('user').equals(req.user.id).populate('user', 'username email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const taskId = getTaskId(req);

  if (!taskId) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { users, type User } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser: User = {
    id: randomUUID(),
    username,
    email,
    passwordHash
  };

  users.push(newUser);

  // Generate token
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, {
    expiresIn: '1d'
  });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1d'
  });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
};

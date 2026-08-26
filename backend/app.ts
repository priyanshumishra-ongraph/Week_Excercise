import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import baseRoutes from './src/routes/base.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import { requestLogger } from './src/middlewares/logger.middleware.js';
import { notFoundHandler, globalErrorHandler } from './src/middlewares/error.middleware.js';

export const app = express();

// Built-in Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use(requestLogger);

// Routers
app.use('/', baseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

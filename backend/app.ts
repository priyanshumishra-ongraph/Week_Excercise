import 'dotenv/config';
import express from 'express';
import cors, { type CorsOptions } from 'cors';
import baseRoutes from './src/routes/base.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import { requestLogger } from './src/middlewares/logger.middleware.js';
import { notFoundHandler, globalErrorHandler } from './src/middlewares/error.middleware.js';

export const app = express();
const allowedOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn('[cors] WARNING: FRONTEND_URL is not set — cross-origin browser requests will be blocked.');
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (health checks, curl, server-to-server) that send no Origin.
    if (!origin) return callback(null, true);

    return allowedOrigins.includes(origin)
      ? callback(null, true)
      : callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

// Built-in Middleware
app.use(cors(corsOptions));
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

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.url} does not exist on this server.`
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: err.issues ? err.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      })) : []
    });
  }

  // Handle Mongoose CastError (invalid ObjectId format) which means resource not found
  if (err instanceof mongoose.Error.CastError && err.kind === 'ObjectId') {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found or invalid ID format.'
    });
  }

  console.error('[Unhandled Error]', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

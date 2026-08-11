import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } 
    }
  };
};

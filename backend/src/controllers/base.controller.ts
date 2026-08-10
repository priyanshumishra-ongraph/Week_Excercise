import type { Request, Response } from 'express';

export const getRoot = (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Hello API!' });
};

export const getHello = (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
};

export const getStatus = (req: Request, res: Response) => {
  res.json({ 
    status: 'API is running smoothly successfully.', 
    uptime: process.uptime() 
  });
};

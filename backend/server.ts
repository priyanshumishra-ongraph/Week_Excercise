import express, { type Request, type Response, type NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Route 1: Root
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Hello API!' });
});

// Route 2: /hello
app.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// Route 3: /api/status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ 
    status: 'API is running smoothly.', 
    uptime: process.uptime() 
  });
});

// 2. 404 Handler Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} does not exist on this server.`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Hello API server is listening on http://localhost:${PORT}`);
});

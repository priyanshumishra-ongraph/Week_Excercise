import express from 'express';
import baseRoutes from './src/routes/base.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import { requestLogger } from './src/middlewares/logger.middleware.js';
import { notFoundHandler } from './src/middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(requestLogger);

// Routers
app.use('/', baseRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use(notFoundHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Hello API server is listening on http://localhost:${PORT}`);
});


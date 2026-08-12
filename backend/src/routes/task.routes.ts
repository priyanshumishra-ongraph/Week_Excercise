import { Router } from 'express';
import { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} from '../controllers/task.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

const router = Router();

// Guard all task routes
router.use(protectRoute);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;

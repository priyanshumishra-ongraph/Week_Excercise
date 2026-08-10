import { Router } from 'express';
import { getRoot, getHello, getStatus } from '../controllers/base.controller.js';

const router = Router();

router.get('/', getRoot);
router.get('/hello', getHello);
router.get('/api/status', getStatus);

export default router;

import { Router } from 'express';
import { toggleLike } from '../controllers/likesController';
import { verifyToken } from '../middleware/auth';

const router = Router();

/**
 * POST /api/posts/:postId/like
 * Alterna entre dar y quitar like (tipo Instagram)
 */
router.post('/posts/:postId/like', verifyToken, toggleLike);

export default router;

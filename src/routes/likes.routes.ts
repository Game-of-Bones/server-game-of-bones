/**
 * LIKES ROUTES
 *
 * Rutas de likes:
 * - POST /api/posts/:postId/like - Dar/quitar like (toggle)
 * - GET /api/posts/:postId/likes - Listar likes de un post
 * - GET /api/posts/:postId/like/check - Verificar si el usuario dio like
 * - GET /api/users/:userId/likes - Posts que le gustaron a un usuario
 */

import { Router } from 'express';
import {
  toggleLike,
  getLikesByPost,
  checkUserLike,
  getLikesByUser,
} from '../controllers/likesController';
import { verifyToken } from '../middleware/auth';
import {
  validateLikePost,
  validateLikePagination,
} from '../middleware/likeValidation';

const router = Router();

/**
 * @route   POST /api/posts/:postId/like
 * @desc    Dar o quitar like a un post (toggle)
 * @access  Private
 */
router.post(
  '/posts/:postId/like',
  verifyToken,
  validateLikePost,
  toggleLike
);

/**
 * @route   GET /api/posts/:postId/likes
 * @desc    Obtener likes de un post
 * @access  Public
 */
router.get(
  '/posts/:postId/likes',
  validateLikePagination,
  getLikesByPost
);

/**
 * @route   GET /api/posts/:postId/like/check
 * @desc    Verificar si el usuario autenticado dio like al post
 * @access  Private
 */
router.get(
  '/posts/:postId/like/check',
  verifyToken,
  checkUserLike
);

/**
 * @route   GET /api/users/:userId/likes
 * @desc    Obtener posts que le gustaron a un usuario
 * @access  Public
 */
router.get(
  '/users/:userId/likes',
  validateLikePagination,
  getLikesByUser
);

export default router;

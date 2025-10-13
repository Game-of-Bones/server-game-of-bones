// src/routes/likes.ts
/**
 * RUTAS DE LIKES
 */

import { Router } from 'express';
import {
  getAllLikes,
  toggleLike,
  getLikesByPost,
  getLikesByUser,
  checkUserLike
} from '../controllers/likesController';
import { verifyToken } from '../middleware/auth';
import {
  validateLikePost,
  validateLikePagination
} from '../middleware/likeValidation';

export function createLikesRouter(): Router {
  const router = Router();

  // ============================================
  // RUTAS PÚBLICAS
  // ============================================

  /**
   * GET /likes
   * Obtener todos los likes (con paginación)
   */
  router.get(
    '/likes',
    getAllLikes
  );

  /**
   * GET /posts/:postId/likes
   * Obtener todos los likes de un post (con paginación)
   */
  router.get(
    '/posts/:postId/likes',
    validateLikePagination,
    getLikesByPost
  );

  /**
   * GET /users/:userId/likes
   * Obtener todos los likes de un usuario
   */
  router.get(
    '/users/:userId/likes',
    validateLikePagination,
    getLikesByUser
  );

  // ============================================
  // RUTAS PROTEGIDAS (Requieren autenticación)
  // ============================================

  /**
   * POST/DELETE /posts/:postId/like
   * Toggle like: dar like o quitar like (según estado actual)
   */
  router.post(
    '/posts/:postId/like',
    verifyToken,
    validateLikePost,
    toggleLike
  );

  /**
   * GET /posts/:postId/like/check
   * Verificar si el usuario autenticado dio like al post
   */
  router.get(
    '/posts/:postId/like/check',
    verifyToken,
    checkUserLike
  );

  return router;
}

export default createLikesRouter;
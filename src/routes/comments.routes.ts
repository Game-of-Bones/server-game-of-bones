/**
 * COMMENTS ROUTES
 *
 * Rutas de comentarios:
 * - GET /api/posts/:postId/comments - Listar comentarios de un post
 * - POST /api/posts/:postId/comments - Crear comentario
 * - GET /api/comments/:id - Ver un comentario
 * - PUT /api/comments/:id - Actualizar comentario
 * - DELETE /api/comments/:id - Eliminar comentario
 * - GET /api/users/:userId/comments - Comentarios de un usuario
 */

import { Router } from 'express';
import {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByUser,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';
import { validateCreateComment, validateUpdateComment } from '../middleware/commentValidation';

const router = Router();

/**
 * @route   GET /api/posts/:postId/comments
 * @desc    Obtener comentarios de un post
 * @access  Public
 */
router.get('/posts/:postId/comments', getCommentsByPost);

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    Crear comentario en un post
 * @access  Private
 */
router.post(
  '/posts/:postId/comments',
  verifyToken,
  validateCreateComment,
  createComment
);

/**
 * @route   GET /api/comments/:id
 * @desc    Ver un comentario específico
 * @access  Public
 */
router.get('/comments/:id', getCommentById);

/**
 * @route   PUT /api/comments/:id
 * @desc    Actualizar comentario
 * @access  Private (solo autor)
 */
router.put(
  '/comments/:id',
  verifyToken,
  validateUpdateComment,
  updateComment
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Eliminar comentario
 * @access  Private (autor o admin)
 */
router.delete('/comments/:id', verifyToken, deleteComment);

/**
 * @route   GET /api/users/:userId/comments
 * @desc    Obtener comentarios de un usuario
 * @access  Public
 */
router.get('/users/:userId/comments', getCommentsByUser);

export default router;

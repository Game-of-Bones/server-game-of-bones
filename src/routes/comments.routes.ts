import { Router } from 'express';
import {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByUser
} from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';
import { validateCreateComment, validateUpdateComment } from '../middleware/validation';

export function createCommentsRouter(): Router {
  const router = Router();

  // Obtener comentarios de un post (público)
  router.get('/posts/:postId/comments', getCommentsByPost);

  // Crear comentario (requiere autenticación + validación)
  router.post(
    '/posts/:postId/comments',
    verifyToken,
    validateCreateComment,
    createComment
  );

  // Ver un comentario específico (público)
  router.get('/comments/:id', getCommentById);

  // Actualizar comentario (requiere autenticación + validación)
  router.put(
    '/comments/:id',
    verifyToken,
    validateUpdateComment,
    updateComment
  );

  // Eliminar comentario (requiere autenticación)
  router.delete(
    '/comments/:id',
    verifyToken,
    deleteComment
  );

  // Ver comentarios de un usuario (público)
  router.get('/users/:userId/comments', getCommentsByUser);

  return router;
}

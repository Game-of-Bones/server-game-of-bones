import { Router } from 'express';
import { CommentsController } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';
import { validateCreateComment, validateUpdateComment } from '../middleware/commentValidation';
import { Pool } from 'mysql2/promise';


export function createCommentsRouter(pool: Pool): Router {
  const router = Router();
  const controller = new CommentsController(pool);

  // Obtener comentarios de un descubrimiento (público)
  router.get('/posts/:postId/comments', controller.getCommentsByPost);

  // Crear comentario (requiere autenticación + validación)
  router.post(
    '/posts/:postId/comments',
    verifyToken,
    validateCreateComment,
    controller.createComment
  );

  // Ver un comentario específico (público)
  router.get('/comments/:id', controller.getCommentById);

  // Actualizar comentario (requiere autenticación + validación)
  router.put(
    '/comments/:id',
    verifyToken,
    validateUpdateComment,
    controller.updateComment
  );

  // Eliminar comentario (requiere autenticación)
  router.delete(
    '/comments/:id',
    verifyToken,
    controller.deleteComment
  );

  // Ver comentarios de un usuario (público)
  router.get('/users/:userId/comments', controller.getCommentsByUser);

  return router;
}
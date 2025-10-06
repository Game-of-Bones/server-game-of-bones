/**
 * CONTROLADOR DE COMENTARIOS
 * 
 * El controller es el cerebro de la operación.
 * Coordina entre el request HTTP, el repository (base de datos),
 * y la respuesta que se envía al cliente.
 * 
 * Responsabilidades:
 * Recibir y procesar requests HTTP
 * Validar permisos (¿es el autor? ¿es admin?)
 * Llamar al repository para operaciones de BD
 * Construir y enviar respuestas HTTP apropiadas
 * Manejar errores y casos edge 
 */

import { Request, Response, NextFunction } from 'express';
import { CommentsRepository } from '../database/repositories/commentsRepository';
import { CreateCommentDTO } from '../models/Comment';
import { Pool } from 'mysql2/promise';


export class CommentsController {
  private repository: CommentsRepository;

  constructor(pool: Pool) {
    this.repository = new CommentsRepository(pool);
  }

  /**
   * GET /api/posts/:postId/comments
   */
  getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = BigInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const postExists = await this.repository.postExists(postId);
      if (!postExists) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado'
        });
      }

      const comments = await this.repository.findByPostId(postId, limit, offset);
      const total = await this.repository.countByPostId(postId);

      return res.status(200).json({
        success: true,
        data: {
          comments,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/comments/:id
   */
  getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = BigInt(req.params.id);
      const comment = await this.repository.findByIdWithUser(commentId);
  
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comentario no encontrado'
        });
      }
  
      return res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/:userId/comments
   */
  getCommentsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const comments = await this.repository.findByUserId(userId, limit, offset);

      return res.status(200).json({
        success: true,
        data: {
          comments,
          pagination: {
            limit,
            offset
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/posts/:postId/comments   
   */
  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = BigInt(req.params.postId);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const postExists = await this.repository.postExists(postId);
      if (!postExists) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado'
        });
      }

      const commentData: CreateCommentDTO = {
        post_id: postId,
        user_id: BigInt(userId),
        content: req.body.content
      };

      const newComment = await this.repository.create(commentData);
      const commentWithUser = await this.repository.findByIdWithUser(newComment.id);

      return res.status(201).json({
        success: true,
        data: commentWithUser,
        message: 'Comentario creado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/comments/:id   
   */
  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = BigInt(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const comment = await this.repository.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comentario no encontrado'
        });
      }

      const isAuthor = await this.repository.isAuthor(commentId, BigInt(userId));
      if (!isAuthor) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para editar este comentario'
        });
      }

      const updatedComment = await this.repository.update(commentId, req.body.content);

      return res.status(200).json({
        success: true,
        data: updatedComment,
        message: 'Comentario actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/comments/:id   
   */
  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = BigInt(req.params.id);
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const comment = await this.repository.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comentario no encontrado'
        });
      }

      const isAuthor = await this.repository.isAuthor(commentId, BigInt(userId));
      const isAdmin = userRole === 'admin' || userRole === 'moderator';

      if (!isAuthor && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para eliminar este comentario'
        });
      }

      await this.repository.delete(commentId);

      return res.status(200).json({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };
}
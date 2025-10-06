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
import { CommentsRepository } from '../database/repositories/commentsRepositroy';
import { CreateCommentDTO } from '../models/Comment';
import { Pool } from 'pg';

export class CommentsController {
  private repository: CommentsRepository;

  constructor(pool: Pool) {
    this.repository = new CommentsRepository(pool);
  }

  /**
   * GET /api/posts/:postId/comments
   * 
   * Obtener todos los comentarios de un post específico
   * 
   * Query params:
   * - limit: Cantidad de comentarios por página (default: 50)
   * - offset: Desde qué posición empezar (default: 0)
   */
  getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extraer parámetros
      const postId = BigInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Verificar si el post existe antes de buscar comentarios
      const postExists = await this.repository.postExists(postId);
      if (!postExists) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado'
        });
      }

      // Obtener comentarios y contador
      const comments = await this.repository.findByPostId(postId, limit, offset);
      const total = await this.repository.countByPostId(postId);

      // Construir respuesta con información de paginación
      return res.status(200).json({
        success: true,
        data: {
          comments,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total  // ¿Hay más comentarios?
          }
        }
      });
    } catch (error) {
      // Pasar error al middleware de manejo de errores
      next(error);
    }
  };

  /**
   * GET /api/comments/:id
   * 
   * Obtener UN comentario específico por su ID
   * Incluye información del usuario que lo escribió
   */
  getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = BigInt(req.params.id);
  
      // Buscar comentario con info del usuario
      const comment = await this.repository.findByIdWithUser(commentId);
  
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comentario no encontrado'
        });
      }
  
      // Si todo va bien, devolvemos el comentario
      return res.status(200).json({
        success: true,
        data: comment
      });
      
    } catch (error) {
      // Si ocurre un error, lo pasamos al middleware de errores
      next(error);
    }
  };
}
  
/**
 * MIDDLEWARE DE VALIDACIÓN PARA LIKES
 *
 * Valida operaciones de likes:
 * - Existencia del post
 * - Estado del post (publicado)
 * - Duplicados de likes
 * - Ownership de likes
 */

import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';
import { Like } from '../models/Like';

/**
 * Validar que el post existe y está publicado antes de dar like
 */
export const validateLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;

    // Validar que postId es un número válido
    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      res.status(400).json({
        success: false,
        message: 'ID de post inválido',
      });
      return;
    }

    // Verificar que el post existe
    const post = await Post.findByPk(postIdNum);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado',
      });
      return;
    }

    // Verificar que el post está publicado
    if (post.status !== 'published') {
      res.status(403).json({
        success: false,
        message: 'No puedes dar like a un post no publicado',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validar que el usuario no ha dado like previamente
 */
export const validateDuplicateLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    const postIdNum = parseInt(postId);

    // Verificar si ya existe el like
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postIdNum,
      },
    });

    if (existingLike) {
      res.status(409).json({
        success: false,
        message: 'Ya diste like a este post',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validar que el usuario tiene un like en el post antes de eliminarlo
 */
export const validateLikeOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    const postIdNum = parseInt(postId);

    // Buscar el like
    const like = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postIdNum,
      },
    });

    if (!like) {
      res.status(404).json({
        success: false,
        message: 'No has dado like a este post',
      });
      return;
    }

    // Verificar ownership (el like siempre pertenece al usuario, admin puede eliminar cualquiera)
    if (like.user_id !== userId && userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este like',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validar parámetros de paginación para likes
 */
export const validateLikePagination = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  // Validar rangos
  if (page < 1) {
    res.status(400).json({
      success: false,
      message: 'El número de página debe ser mayor a 0',
    });
    return;
  }

  if (limit < 1 || limit > 100) {
    res.status(400).json({
      success: false,
      message: 'El límite debe estar entre 1 y 100',
    });
    return;
  }

  next();
};

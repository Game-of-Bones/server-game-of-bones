// src/middleware/likeValidation.ts
/**
 * VALIDACIONES PARA LIKES
 */

import { Request, Response, NextFunction } from 'express';
import Fossil from '../models/Posts';
import { Like } from '../models/Like';

/**
 * Validar que el post existe antes de dar like
 */
export const validateLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;

    // Validar que postId es un número válido
    if (!postId || isNaN(Number(postId))) {
      res.status(400).json({
        success: false,
        message: 'ID de post inválido'
      });
      return;
    }

    // Verificar que el post existe
    const post = await Fossil.findByPk(Number(postId));

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }

    // Verificar que el post está publicado
    if (post.status !== 'published') {
      res.status(403).json({
        success: false,
        message: 'No puedes dar like a un post no publicado'
      });
      return;
    }

    // Agregar el post a la request para usarlo en el controlador
    req.post = post;

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
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Verificar si ya existe el like
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: Number(postId)
      }
    });

    if (existingLike) {
      res.status(409).json({
        success: false,
        message: 'Ya diste like a este post'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validar que el like pertenece al usuario antes de eliminarlo
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
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Buscar el like
    const like = await Like.findOne({
      where: {
        user_id: userId,
        post_id: Number(postId)
      }
    });

    if (!like) {
      res.status(404).json({
        success: false,
        message: 'No has dado like a este post'
      });
      return;
    }

    // Verificar que el like pertenece al usuario (o es admin)
    if (like.user_id !== userId && userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este like'
      });
      return;
    }

    // Agregar el like a la request
    req.like = like;

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
      message: 'El número de página debe ser mayor a 0'
    });
    return;
  }

  if (limit < 1 || limit > 100) {
    res.status(400).json({
      success: false,
      message: 'El límite debe estar entre 1 y 100'
    });
    return;
  }

  // Agregar valores validados a la request
  req.pagination = { page, limit };

  next();
};
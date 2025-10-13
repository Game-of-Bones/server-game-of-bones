/**
 * LIKES CONTROLLER
 *
 * Maneja operaciones de likes:
 * - Dar/quitar like (toggle)
 * - Listar likes de un post
 * - Listar posts que le gustaron a un usuario
 * - Verificar si un usuario dio like
 */

import { Request, Response } from 'express';
import { Like } from '../models/Like';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { asyncHandler } from '../middleware/handleError';

/**
 * Obtener TODOS los likes (solo admin)
 * GET /api/likes
 */
export const getAllLikes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows: likes } = await Like.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email'],
      },
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'summary', 'image_url'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      likes,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    },
  });
});

/**
 * Toggle Like (Dar o quitar like)
 * POST /api/posts/:postId/like
 * Requiere autenticación
 */
export const toggleLike = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user!.id;
  const postIdNum = parseInt(postId);

  // Verificar que el post existe y está publicado
  const post = await Post.findByPk(postIdNum);
  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  if (post.status !== 'published') {
    res.status(403).json({
      success: false,
      message: 'No puedes dar like a un post no publicado',
    });
    return;
  }

  // Buscar si ya existe el like
  const existingLike = await Like.findOne({
    where: {
      user_id: userId,
      post_id: postIdNum,
    },
  });

  if (existingLike) {
    // Si existe, eliminar (quitar like)
    await existingLike.destroy();

    res.status(200).json({
      success: true,
      message: 'Like eliminado',
      data: {
        liked: false,
        postId: postIdNum,
      },
    });
    return;
  }

  // Si no existe, crear (dar like)
  const newLike = await Like.create({
    user_id: userId,
    post_id: postIdNum,
  });

  res.status(201).json({
    success: true,
    message: 'Like agregado',
    data: {
      liked: true,
      postId: postIdNum,
      likeId: newLike.id,
    },
  });
});

/**
 * Obtener likes de un post específico
 * GET /api/posts/:postId/likes
 */
export const getLikesByPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const { page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;
  const postIdNum = parseInt(postId);

  // Verificar que el post existe
  const post = await Post.findByPk(postIdNum);
  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  const { count, rows: likes } = await Like.findAndCountAll({
    where: { post_id: postIdNum },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      likes,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    },
  });
});

/**
 * Obtener posts a los que un usuario dio like
 * GET /api/users/:userId/likes
 */
export const getLikesByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;
  const userIdNum = parseInt(userId);

  // Verificar que el usuario existe
  const user = await User.findByPk(userIdNum);
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
    return;
  }

  const { count, rows: likes } = await Like.findAndCountAll({
    where: { user_id: userIdNum },
    include: [
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'summary', 'image_url', 'status'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
      },
      likes,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    },
  });
});

/**
 * Verificar si el usuario autenticado dio like al post
 * GET /api/posts/:postId/like/check
 */
export const checkUserLike = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user!.id;
  const postIdNum = parseInt(postId);

  const like = await Like.findOne({
    where: {
      user_id: userId,
      post_id: postIdNum,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      liked: !!like,
      likeId: like?.id || null,
    },
  });
});

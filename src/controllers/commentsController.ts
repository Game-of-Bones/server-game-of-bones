/**
 * COMMENTS CONTROLLER
 *
 * Maneja operaciones CRUD de comentarios:
 * - Listar todos los comentarios (admin)
 * - Listar comentarios de un post
 * - Crear comentario
 * - Actualizar comentario (solo autor)
 * - Eliminar comentario (autor o admin)
 */

import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { asyncHandler } from '../middleware/handleError';

/**
 * Obtener TODOS los comentarios (solo admin)
 * GET /api/comments
 */
export const getAllComments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows: comments } = await Comment.findAndCountAll({
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email'],
      },
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'summary'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      comments,
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
 * Obtener comentarios de un post específico
 * GET /api/posts/:postId/comments
 */
export const getCommentsByPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  // Verificar que el post existe
  const post = await Post.findByPk(postId);
  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  const comments = await Comment.findAll({
    where: { post_id: postId },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({
    success: true,
    data: {
      comments,
      count: comments.length,
    },
  });
});

/**
 * Crear un nuevo comentario
 * POST /api/posts/:postId/comments
 * Requiere autenticación
 */
export const createComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  // Verificar que el post existe y está publicado
  const post = await Post.findByPk(postId);
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
      message: 'No puedes comentar en un post no publicado',
    });
    return;
  }

  const comment = await Comment.create({
    post_id: parseInt(postId),
    user_id: userId,
    content,
  });

  // Cargar la relación author para la respuesta
  await comment.reload({
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email'],
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Comentario creado exitosamente',
    data: comment.toJSON(),
  });
});

/**
 * Obtener un comentario por ID
 * GET /api/comments/:id
 */
export const getCommentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email'],
      },
    ],
  });

  if (!comment) {
    res.status(404).json({
      success: false,
      message: 'Comentario no encontrado',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: comment.toJSON(),
  });
});

/**
 * Actualizar un comentario
 * PUT /api/comments/:id
 * Solo el autor puede actualizar
 */
export const updateComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  const comment = await Comment.findByPk(id);

  if (!comment) {
    res.status(404).json({
      success: false,
      message: 'Comentario no encontrado',
    });
    return;
  }

  // Solo el autor puede actualizar (ni siquiera admin)
  if (comment.user_id !== userId) {
    res.status(403).json({
      success: false,
      message: 'Solo el autor puede editar este comentario',
    });
    return;
  }

  await comment.update({ content });

  res.status(200).json({
    success: true,
    message: 'Comentario actualizado exitosamente',
    data: comment.toJSON(),
  });
});

/**
 * Eliminar un comentario
 * DELETE /api/comments/:id
 * El autor o admin pueden eliminar
 */
export const deleteComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const comment = await Comment.findByPk(id);

  if (!comment) {
    res.status(404).json({
      success: false,
      message: 'Comentario no encontrado',
    });
    return;
  }

  // Verificar permisos (autor o admin)
  if (comment.user_id !== userId && userRole !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'No tienes permiso para eliminar este comentario',
    });
    return;
  }

  await comment.destroy();

  res.status(200).json({
    success: true,
    message: 'Comentario eliminado exitosamente',
  });
});

/**
 * Obtener comentarios de un usuario
 * GET /api/users/:userId/comments
 */
export const getCommentsByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  // Verificar que el usuario existe
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
    return;
  }

  const comments = await Comment.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'summary'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({
    success: true,
    data: {
      comments,
      count: comments.length,
    },
  });
});

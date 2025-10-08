// src/controllers/commentsController.ts
import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
// TODO: Descomentar cuando el modelo Post esté disponible
// import { Post } from '../models/Post';

/**
 * Crear un nuevo comentario
 * POST /gameofbones/posts/:postId/comments
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id; // Del middleware verifyToken

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // TODO: Verificar que el post existe cuando Post esté disponible
    /*
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }
    */

    // Crear el comentario
    const comment = await Comment.create({
      post_id: parseInt(postId),
      user_id: userId,
      content
    });

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comment
    });
  } catch (error: any) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear comentario',
      error: error.message
    });
  }
};

/**
 * Obtener comentarios de un post
 * GET /gameofbones/posts/:postId/comments
 */
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // TODO: Verificar que el post existe cuando Post esté disponible
    /*
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }
    */

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: comments,
      count: comments.length
    });
  } catch (error: any) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentarios',
      error: error.message
    });
  }
};

/**
 * Obtener un comentario por ID
 * GET /gameofbones/comments/:id
 */
export const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error: any) {
    console.error('Error al obtener comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentario',
      error: error.message
    });
  }
};

/**
 * Actualizar un comentario
 * PUT /gameofbones/comments/:id
 */
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
      return;
    }

    // Verificar que el usuario es el autor del comentario
    if (comment.user_id !== userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este comentario'
      });
      return;
    }

    // Actualizar
    await comment.update({ content });

    res.status(200).json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: comment
    });
  } catch (error: any) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar comentario',
      error: error.message
    });
  }
};

/**
 * Eliminar un comentario (soft delete)
 * DELETE /gameofbones/comments/:id
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
      return;
    }

    // Verificar que el usuario es el autor del comentario o es admin
    if (comment.user_id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este comentario'
      });
      return;
    }

    // Soft delete
    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar comentario',
      error: error.message
    });
  }
};

/**
 * Obtener comentarios de un usuario
 * GET /gameofbones/users/:userId/comments
 */
export const getCommentsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    const comments = await Comment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: comments,
      count: comments.length
    });
  } catch (error: any) {
    console.error('Error al obtener comentarios del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentarios del usuario',
      error: error.message
    });
  }
};
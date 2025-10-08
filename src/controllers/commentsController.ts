/**
 * CONTROLADOR DE COMENTARIOS CON SEQUELIZE
 * 
 * Ahora usa directamente los modelos de Sequelize
 * sin necesidad de repositories
 */

// src/controllers/commentsController.ts
import { Request, Response } from 'express';
import Comment from '../models/Comment';
// @ts-ignore
import Post from '../models/Post'; 
// @ts-ignore
import User from '../models/User';

// Interfaz para comentario con tipado
interface CommentWithRelations {
  id: bigint;
  content: string;
  user_id: bigint;
  post_id: bigint;
  parent_id: bigint | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: bigint;
    username: string;
  };
  replies?: CommentWithRelations[];
}

// Crear un comentario
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { post_id, user_id, content, parent_id } = req.body;

    // Verificar que el post existe
    const post = await Post.findByPk(post_id);
    if (!post) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    // Verificar que el usuario existe
    const user = await User.findByPk(user_id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parent_id) {
      const parentComment = await Comment.findByPk(parent_id);
      if (!parentComment) {
        res.status(404).json({ message: 'Comentario padre no encontrado' });
        return;
      }
    }

    const comment = await Comment.create({
      post_id: BigInt(post_id),
      user_id: BigInt(user_id),
      content,
      parent_id: parent_id ? BigInt(parent_id) : null,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

// Obtener comentarios de un post
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { post_id } = req.params;

    const comments = await Comment.findAll({
      where: { 
        post_id: BigInt(post_id),
        parent_id: null // Solo comentarios principales
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Convertir BigInt a string para serialización JSON
    const serializedComments = comments.map((c: any) => ({
      ...c.toJSON(),
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id.toString(),
      parent_id: c.parent_id ? c.parent_id.toString() : null,
      replies: c.replies?.map((r: any) => ({
        ...r.toJSON(),
        id: r.id.toString(),
        post_id: r.post_id.toString(),
        user_id: r.user_id.toString(),
        parent_id: r.parent_id ? r.parent_id.toString() : null,
      })),
    }));

    res.json(serializedComments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

// Obtener un comentario por ID
export const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(BigInt(id), {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username'],
            },
          ],
        },
      ],
    });

    if (!comment) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    const serializedComment = {
      ...comment.toJSON(),
      id: comment.id.toString(),
      post_id: comment.post_id.toString(),
      user_id: comment.user_id.toString(),
      parent_id: comment.parent_id ? comment.parent_id.toString() : null,
    };

    res.json(serializedComment);
  } catch (error) {
    console.error('Error al obtener comentario:', error);
    res.status(500).json({ message: 'Error al obtener el comentario' });
  }
};

// Actualizar un comentario
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(BigInt(id));

    if (!comment) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    await comment.update({ content });

    res.json(comment);
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({ message: 'Error al actualizar el comentario' });
  }
};

// Eliminar un comentario
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(BigInt(id));

    if (!comment) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    await comment.destroy();

    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ message: 'Error al eliminar el comentario' });
  }
};
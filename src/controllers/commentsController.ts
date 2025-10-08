import { Request, Response } from 'express';
import Comment from '../models/comment'; // ✅ nombre correcto
// @ts-ignore
import Post from '../models/Post';
// @ts-ignore
import User from '../models/User';

/**
 * Crea un comentario simple asociado a un post.
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { post_id, user_id, content } = req.body;

    const post = await Post.findByPk(post_id);
    if (!post) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const comment = await Comment.create({
      post_id: BigInt(post_id),
      user_id: BigInt(user_id),
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

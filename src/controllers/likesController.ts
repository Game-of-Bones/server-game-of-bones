import { Request, Response } from 'express';
import { Like } from '../models/Like';
import { Post } from '../models/Post';
import { User } from '../models/User';

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const postId = Number(req.params.postId);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const post = await Post.findByPk(postId, { include: [User] });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post no encontrado' });
    }

    // Buscar si el like ya existe
    const existing = await Like.findOne({
      where: { user_id: userId, post_id: postId },
    });

    if (existing) {
      // Si existe → eliminar (toggle off)
      await existing.destroy();
      const likes_count = await Like.count({ where: { post_id: postId } });
      return res.status(200).json({
        success: true,
        liked: false,
        message: 'Like eliminado',
        likes_count,
      });
    }

    // Si no existe → crear (toggle on)
    await Like.create({ user_id: userId, post_id: postId });
    const likes_count = await Like.count({ where: { post_id: postId } });

    return res.status(201).json({
      success: true,
      liked: true,
      message: 'Like agregado',
      likes_count,
    });
  } catch (error: any) {
    console.error('❌ Error en toggleLike:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar like',
      error: error.message,
    });
  }
};

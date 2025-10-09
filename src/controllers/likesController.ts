import { Request, Response } from 'express';
import { Like } from '../models/Like';
import { Post } from '../models/Post';

/**
 * Obtener el número de likes de un post
 * GET /gameofbones/posts/:postId/likes
 */
export const getLikesByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // TODO: Verificar que el post existe cuando el modelo Post esté disponible
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

    const likeCount = await Like.count({
      where: { post_id: postId }
    });

    res.status(200).json({
      success: true,
      count: likeCount
    });
  } catch (error: any) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener likes del post',
      error: error.message
    });
  }
};

/**
 * Añadir o quitar un like de un post.
 * POST /gameofbones/posts/:postId/likes
 * Si el usuario ya ha dado like, se elimina. Si no, se añade.
 */
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id; // Del middleware verifyToken

    // 1. Validar que el usuario está autenticado
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado para dar like'
      });
      return;
    }

    const postIdParsed = parseInt(postId, 10);

    // 2. (Opcional pero recomendado) Verificar que el post existe
    // TODO: Descomentar cuando el modelo Post esté disponible
    /*
    const post = await Post.findByPk(postIdParsed);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }
    */

    // 3. Buscar si ya existe un like de este usuario para este post
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postIdParsed
      }
    });

    if (existingLike) {
      // Si existe, eliminar el like
      await existingLike.destroy();
      res.status(200).json({
        success: true,
        message: 'Like eliminado exitosamente'
      });
    } else {
      // Si no existe, crear el like
      const newLike = await Like.create({
        user_id: userId,
        post_id: postIdParsed
      });
      res.status(201).json({
        success: true,
        message: 'Like añadido exitosamente',
        data: newLike
      });
    }
  } catch (error: any) {
    console.error('Error al añadir/quitar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el like',
      error: error.message
    });
  }
};

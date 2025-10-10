// src/controllers/likesController.ts
/**
 * CONTROLADOR DE LIKES
 */

import { Request, Response } from 'express';
import { Like } from '../models/Like';
import { User } from '../models/User';
import Fossil from '../models/GobModelPost';

/**
 * Toggle Like (Dar o quitar like)
 * POST /posts/:postId/like
 */
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!.id;

    // Buscar si ya existe el like
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: Number(postId)
      }
    });

    if (existingLike) {
      // Si existe, eliminar (quitar like)
      await existingLike.destroy();

      res.status(200).json({
        success: true,
        message: 'Like eliminado',
        data: {
          liked: false,
          postId: Number(postId)
        }
      });
      return;
    }

    // Si no existe, crear (dar like)
    const newLike = await Like.create({
      user_id: userId,
      post_id: Number(postId)
    });

    res.status(201).json({
      success: true,
      message: 'Like agregado',
      data: {
        liked: true,
        postId: Number(postId),
        likeId: newLike.id
      }
    });
  } catch (error) {
    console.error('Error en toggleLike:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar like'
    });
  }
};

/**
 * Obtener likes de un post
 * GET /posts/:postId/likes
 */
export const getLikesByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.pagination || {};

    const offset = (page - 1) * limit;

    // Contar total de likes
    const total = await Like.count({
      where: { post_id: Number(postId) }
    });

    // Obtener likes con información del usuario
    const likes = await Like.findAll({
      where: { post_id: Number(postId) },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: {
        likes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error en getLikesByPost:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener likes del post'
    });
  }
};

/**
 * Obtener posts a los que un usuario dio like
 * GET /users/:userId/likes
 */
export const getLikesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.pagination || {};

    const offset = (page - 1) * limit;

    // Verificar que el usuario existe
    const user = await User.findByPk(Number(userId));
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Contar total de likes
    const total = await Like.count({
      where: { user_id: Number(userId) }
    });

    // Obtener likes con información del post
    const likes = await Like.findAll({
      where: { user_id: Number(userId) },
      include: [
        {
          model: Fossil,
          as: 'post',
          attributes: ['id', 'title', 'summary', 'image_url', 'status']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username
        },
        likes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error en getLikesByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener likes del usuario'
    });
  }
};

/**
 * Verificar si el usuario autenticado dio like al post
 * GET /posts/:postId/like/check
 */
export const checkUserLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!.id;

    const like = await Like.findOne({
      where: {
        user_id: userId,
        post_id: Number(postId)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        liked: !!like,
        likeId: like?.id || null
      }
    });
  } catch (error) {
    console.error('Error en checkUserLike:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar like'
    });
  }
};
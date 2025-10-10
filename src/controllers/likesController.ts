// import { Request, Response, NextFunction } from "express";
// import LikeManager from "../models/LikeManager";

// // Create an instance of the manager that we will use in the controllers
// const likeManager = new LikeManager();

// /**
//  * Gets the number of likes for a specific post.
//  */
// const getLikesByPostId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const postId = parseInt(req.params.postId, 10);
//     const likeCount = await likeManager.findCountByPostId(postId);

//     res.status(200).json({ count: likeCount });
//   } catch (err) {
//     next(err);
//   }
// };

// /**
//  * Adds or removes a like from a post.
//  * If the user has already liked the post, the like is removed.
//  * If not, it is added.
//  */
// const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const postId = parseInt(req.params.postId, 10);
//     // We assume the user ID comes from the authentication middleware
//     const userId = req.user?.id;

//     // Validate that the user is authenticated
//     if (!userId) {
//       return res.status(401).json({ error: 'Usuario no autenticado' });
//     }

//     // Check if the like already exists
//     const existingLike = await likeManager.findUserLikeForPost(userId, postId);

//     if (existingLike) {
//       await likeManager.delete({ user_id: userId, post_id: postId });
//       res.status(200).json({ message: "Like removed successfully" });
//     } else {
//       const result = await likeManager.add({ user_id: userId, post_id: postId });
//       res.status(201).json({ insertId: result, message: "Like added successfully" });
//     }
//   } catch (err) {
//     // Check if the error is a MySQL error for a non-existent foreign key
//     if (
//       err &&
//       typeof err === "object" &&
//       "code" in err &&
//       err.code === "ER_NO_REFERENCED_ROW_2"
//     ) {
//       res.status(404).send("Post not found");
//     } else {
//       next(err);
//     }
//   }
// };

// export { getLikesByPostId, toggleLike };

// src/controllers/likesController.ts
import { Request, Response } from 'express';
import { Like } from '../models/Like';
import Fossil from '../models/GobModelPost';
import { User } from '../models/User';

/**
 * Obtener el número de likes de un post
 * GET /api/posts/:postId/likes
 */
export const getLikesByPostId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // Verificar que el post existe
    const post = await Fossil.findByPk(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }

    // Contar likes
    const likeCount = await Like.count({
      where: { post_id: postId }
    });

    res.status(200).json({
      success: true,
      data: {
        post_id: postId,
        count: likeCount
      }
    });
  } catch (error: any) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener likes',
      error: error.message
    });
  }
};

/**
 * Toggle like (añadir o quitar like)
 * POST /api/posts/:postId/like
 */
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    // Validar autenticación
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Verificar que el post existe
    const post = await Fossil.findByPk(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }

    // Buscar si ya existe el like
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postId
      }
    });

    if (existingLike) {
      // Si existe, lo eliminamos (unlike)
      await existingLike.destroy();

      res.status(200).json({
        success: true,
        message: 'Like eliminado exitosamente',
        action: 'unliked'
      });
    } else {
      // Si no existe, lo creamos (like)
      const newLike = await Like.create({
        user_id: userId,
        post_id: parseInt(postId)
      });

      res.status(201).json({
        success: true,
        message: 'Like añadido exitosamente',
        action: 'liked',
        data: newLike
      });
    }
  } catch (error: any) {
    console.error('Error al toggle like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar like',
      error: error.message
    });
  }
};

/**
 * Verificar si un usuario ha dado like a un post
 * GET /api/posts/:postId/like/check
 */
export const checkUserLike = async (req: Request, res: Response): Promise<void> => {
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

    const like = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postId
      }
    });

    res.status(200).json({
      success: true,
      data: {
        hasLiked: !!like,
        like: like || null
      }
    });
  } catch (error: any) {
    console.error('Error al verificar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar like',
      error: error.message
    });
  }
};

/**
 * Obtener todos los likes de un usuario
 * GET /api/users/:userId/likes
 */
export const getLikesByUser = async (req: Request, res: Response): Promise<void> => {
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

    const likes = await Like.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Fossil,
          as: 'post',
          attributes: ['id', 'title', 'summary', 'image_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: likes,
      count: likes.length
    });
  } catch (error: any) {
    console.error('Error al obtener likes del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener likes del usuario',
      error: error.message
    });
  }
};

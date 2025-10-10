import { Request, Response } from 'express';
/**
 * Obtener el número de likes de un post
 * GET /api/posts/:postId/likes
 */
export declare const getLikesByPostId: (req: Request, res: Response) => Promise<void>;
/**
 * Toggle like (añadir o quitar like)
 * POST /api/posts/:postId/like
 */
export declare const toggleLike: (req: Request, res: Response) => Promise<void>;
/**
 * Verificar si un usuario ha dado like a un post
 * GET /api/posts/:postId/like/check
 */
export declare const checkUserLike: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener todos los likes de un usuario
 * GET /api/users/:userId/likes
 */
export declare const getLikesByUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=likesController.d.ts.map
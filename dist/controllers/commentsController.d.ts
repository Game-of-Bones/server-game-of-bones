import { Request, Response } from 'express';
/**
 * Crear un nuevo comentario
 * POST /gameofbones/posts/:postId/comments
 */
export declare const createComment: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener comentarios de un post
 * GET /gameofbones/posts/:postId/comments
 */
export declare const getCommentsByPost: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener un comentario por ID
 * GET /gameofbones/comments/:id
 */
export declare const getCommentById: (req: Request, res: Response) => Promise<void>;
/**
 * Actualizar un comentario
 * PUT /gameofbones/comments/:id
 */
export declare const updateComment: (req: Request, res: Response) => Promise<void>;
/**
 * Eliminar un comentario (soft delete)
 * DELETE /gameofbones/comments/:id
 */
export declare const deleteComment: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener comentarios de un usuario
 * GET /gameofbones/users/:userId/comments
 */
export declare const getCommentsByUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=commentsController.d.ts.map
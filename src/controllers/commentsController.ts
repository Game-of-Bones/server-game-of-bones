import { Request, Response } from 'express';
import Comment from '../models/Comment';
// @ts-ignore
import Post from '../models/Post';
// @ts-ignore
import User from '../models/User';

// Interfaz para comentario con tipado simplificado
interface CommentWithRelations {
    id: number;          
    content: string;
    user_id: number;     
    post_id: number;     
    created_at: Date;
    updated_at: Date;
    user?: {
        id: number;      
        username: string;
    };
}

/**
 * Crea un comentario simple asociado a un post.
 * POST /api/comments
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { post_id, user_id, content } = req.body;

        // Validar que todos los campos estén presentes
        if (!post_id || !user_id || !content) {
            res.status(400).json({ 
                success: false,
                message: 'Todos los campos son requeridos (post_id, user_id, content)' 
            });
            return;
        }

        // Verificar que el post existe
        const post = await Post.findByPk(post_id);
        if (!post) {
            res.status(404).json({ 
                success: false,
                message: 'Post no encontrado' 
            });
            return;
        }

        // Verificar que el usuario existe
        const user = await User.findByPk(user_id);
        if (!user) {
            res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
            return;
        }

        // Crear el comentario - ya no necesitamos BigInt()
        const comment = await Comment.create({
            post_id: Number(post_id),    
            user_id: Number(user_id),    
            content,
        });

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente',
            data: comment
        });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear el comentario' 
        });
    }
};

/**
 * Obtiene todos los comentarios de un post.
 * GET /api/comments/post/:postId
 */
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: {
                post_id: Number(postId),  
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los comentarios' 
        });
    }
};

/**
 * Obtiene un comentario por ID.
 * GET /api/comments/:id
 */
export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(Number(id), {  
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
            ],
        });

        if (!comment) {
            res.status(404).json({ 
                success: false,
                message: 'Comentario no encontrado' 
            });
            return;
        }

        res.json({
            success: true,
            data: comment
        });
    } catch (error) {
        console.error('Error al obtener comentario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener el comentario' 
        });
    }
};

/**
 * Actualiza el contenido de un comentario.
 * PUT /api/comments/:id
 */
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ 
                success: false,
                message: 'El contenido es requerido' 
            });
            return;
        }

        const comment = await Comment.findByPk(Number(id));  

        if (!comment) {
            res.status(404).json({ 
                success: false,
                message: 'Comentario no encontrado' 
            });
            return;
        }

        await comment.update({ content });

        res.json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comment
        });
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar el comentario' 
        });
    }
};

/**
 * Elimina lógicamente un comentario (soft delete).
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(Number(id));  

        if (!comment) {
            res.status(404).json({ 
                success: false,
                message: 'Comentario no encontrado' 
            });
            return;
        }

        await comment.destroy(); // Soft delete gracias a paranoid: true

        res.json({ 
            success: true,
            message: 'Comentario eliminado correctamente' 
        });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar el comentario' 
        });
    }
};

/**
 * Obtiene los comentarios hechos por un usuario.
 * GET /api/comments/user/:userId
 */
export const getCommentsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const comments = await Comment.findAll({
            where: {
                user_id: Number(userId),  
            },
            include: [
                {
                    model: Post,
                    as: 'post',
                    attributes: ['id', 'title'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Error al obtener comentarios del usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los comentarios del usuario' 
        });
    }
};
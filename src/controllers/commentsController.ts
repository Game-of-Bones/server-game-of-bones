import { Request, Response } from 'express';
import Comment from '../models/Comment';
// @ts-ignore
import Post from '../models/Post'; 
// @ts-ignore
import User from '../models/User';

// Interfaz para comentario con tipado simplificado
interface CommentWithRelations {
    id: bigint;
    content: string;
    user_id: bigint;
    post_id: bigint;
    created_at: Date;
    updated_at: Date;
    user?: {
        id: bigint;
        username: string;
    };
}

/**
 * Crea un comentario simple asociado a un post.
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Se elimina 'parent_id' ya que no está soportado en el modelo actual
        const { post_id, user_id, content } = req.body; 

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

        const comment = await Comment.create({
            post_id: BigInt(post_id),
            user_id: BigInt(user_id),
            content,
            // parent_id ha sido removido
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error al crear el comentario' });
    }
};

/**
 * Obtiene todos los comentarios de un post.
 * No incluye lógica de anidación.
 */
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { post_id } = req.params;

        const comments = await Comment.findAll({
            // Se elimina el filtro parent_id: null
            where: { 
                post_id: BigInt(post_id),
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
                // Se elimina la inclusión recursiva de 'replies'
            ],
            order: [['created_at', 'DESC']],
        });

        // Convertir BigInt a string para serialización JSON
        const serializedComments = comments.map((c: any) => ({
            ...c.toJSON(),
            id: c.id.toString(),
            post_id: c.post_id.toString(),
            user_id: c.user_id.toString(),
            // parent_id y replies han sido removidos
        }));

        res.json(serializedComments);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
};

/**
 * Obtiene un comentario por ID.
 * No incluye lógica de anidación.
 */
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
                // Se elimina la inclusión recursiva de 'replies'
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
            // parent_id ha sido removido
        };

        res.json(serializedComment);
    } catch (error) {
        console.error('Error al obtener comentario:', error);
        res.status(500).json({ message: 'Error al obtener el comentario' });
    }
};

/**
 * Actualiza el contenido de un comentario.
 */
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

        // Convertir BigInt para la respuesta
        const serializedComment = {
            ...comment.toJSON(),
            id: comment.id.toString(),
            post_id: comment.post_id.toString(),
            user_id: comment.user_id.toString(),
        };

        res.json(serializedComment);
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        res.status(500).json({ message: 'Error al actualizar el comentario' });
    }
};

/**
 * Elimina lógicamente un comentario (soft delete).
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(BigInt(id));

        if (!comment) {
            res.status(404).json({ message: 'Comentario no encontrado' });
            return;
        }

        // destroy() aplica soft delete gracias a la configuración paranoid: true en el modelo
        await comment.destroy(); 

        res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: 'Error al eliminar el comentario' });
    }
};
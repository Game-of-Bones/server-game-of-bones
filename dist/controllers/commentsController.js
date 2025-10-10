"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByUser = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getCommentsByPost = exports.createComment = void 0;
const Comment_1 = require("../models/Comment");
const User_1 = require("../models/User");
// TODO: Descomentar cuando el modelo Post esté disponible
// import { Post } from '../models/Post';
/**
 * Crear un nuevo comentario
 * POST /gameofbones/posts/:postId/comments
 */
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user?.id; // Del middleware verifyToken
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
            return;
        }
        // TODO: Verificar que el post existe cuando Post esté disponible
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
        // Crear el comentario
        const comment = await Comment_1.Comment.create({
            post_id: parseInt(postId),
            user_id: userId,
            content
        });
        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente',
            data: comment
        });
    }
    catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear comentario',
            error: error.message
        });
    }
};
exports.createComment = createComment;
/**
 * Obtener comentarios de un post
 * GET /gameofbones/posts/:postId/comments
 */
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        // TODO: Verificar que el post existe cuando Post esté disponible
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
        const comments = await Comment_1.Comment.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: User_1.User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: comments,
            count: comments.length
        });
    }
    catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message
        });
    }
};
exports.getCommentsByPost = getCommentsByPost;
/**
 * Obtener un comentario por ID
 * GET /gameofbones/comments/:id
 */
const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment_1.Comment.findByPk(id, {
            include: [
                {
                    model: User_1.User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        if (!comment) {
            res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.error('Error al obtener comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentario',
            error: error.message
        });
    }
};
exports.getCommentById = getCommentById;
/**
 * Actualizar un comentario
 * PUT /gameofbones/comments/:id
 */
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user?.id;
        const comment = await Comment_1.Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
            return;
        }
        // Verificar que el usuario es el autor del comentario
        if (comment.user_id !== userId) {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar este comentario'
            });
            return;
        }
        // Actualizar
        await comment.update({ content });
        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comment
        });
    }
    catch (error) {
        console.error('Error al actualizar comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar comentario',
            error: error.message
        });
    }
};
exports.updateComment = updateComment;
/**
 * Eliminar un comentario (soft delete)
 * DELETE /gameofbones/comments/:id
 */
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const comment = await Comment_1.Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
            return;
        }
        // Verificar que el usuario es el autor del comentario o es admin
        if (comment.user_id !== userId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
            return;
        }
        // Soft delete
        await comment.destroy();
        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: error.message
        });
    }
};
exports.deleteComment = deleteComment;
/**
 * Obtener comentarios de un usuario
 * GET /gameofbones/users/:userId/comments
 */
const getCommentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // Verificar que el usuario existe
        const user = await User_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        const comments = await Comment_1.Comment.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: User_1.User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: comments,
            count: comments.length
        });
    }
    catch (error) {
        console.error('Error al obtener comentarios del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios del usuario',
            error: error.message
        });
    }
};
exports.getCommentsByUser = getCommentsByUser;
//# sourceMappingURL=commentsController.js.map
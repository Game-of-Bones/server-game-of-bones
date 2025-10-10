"use strict";
// import { Request, Response, NextFunction } from "express";
// import LikeManager from "../models/LikeManager";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesByUser = exports.checkUserLike = exports.toggleLike = exports.getLikesByPostId = void 0;
const Like_1 = require("../models/Like");
const GobModelPost_1 = __importDefault(require("../models/GobModelPost"));
const User_1 = require("../models/User");
/**
 * Obtener el número de likes de un post
 * GET /api/posts/:postId/likes
 */
const getLikesByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        // Verificar que el post existe
        const post = await GobModelPost_1.default.findByPk(postId);
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
            return;
        }
        // Contar likes
        const likeCount = await Like_1.Like.count({
            where: { post_id: postId }
        });
        res.status(200).json({
            success: true,
            data: {
                post_id: postId,
                count: likeCount
            }
        });
    }
    catch (error) {
        console.error('Error al obtener likes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener likes',
            error: error.message
        });
    }
};
exports.getLikesByPostId = getLikesByPostId;
/**
 * Toggle like (añadir o quitar like)
 * POST /api/posts/:postId/like
 */
const toggleLike = async (req, res) => {
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
        const post = await GobModelPost_1.default.findByPk(postId);
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
            return;
        }
        // Buscar si ya existe el like
        const existingLike = await Like_1.Like.findOne({
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
        }
        else {
            // Si no existe, lo creamos (like)
            const newLike = await Like_1.Like.create({
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
    }
    catch (error) {
        console.error('Error al toggle like:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar like',
            error: error.message
        });
    }
};
exports.toggleLike = toggleLike;
/**
 * Verificar si un usuario ha dado like a un post
 * GET /api/posts/:postId/like/check
 */
const checkUserLike = async (req, res) => {
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
        const like = await Like_1.Like.findOne({
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
    }
    catch (error) {
        console.error('Error al verificar like:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar like',
            error: error.message
        });
    }
};
exports.checkUserLike = checkUserLike;
/**
 * Obtener todos los likes de un usuario
 * GET /api/users/:userId/likes
 */
const getLikesByUser = async (req, res) => {
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
        const likes = await Like_1.Like.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: GobModelPost_1.default,
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
    }
    catch (error) {
        console.error('Error al obtener likes del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener likes del usuario',
            error: error.message
        });
    }
};
exports.getLikesByUser = getLikesByUser;
//# sourceMappingURL=likesController.js.map
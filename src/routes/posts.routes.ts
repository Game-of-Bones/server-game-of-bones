/**
 * POSTS ROUTES
 *
 * Rutas de posts (descubrimientos de fósiles):
 * - GET /api/posts - Listar posts (con filtros y paginación)
 * - GET /api/posts/:id - Ver un post
 * - POST /api/posts - Crear post (requiere auth)
 * - PUT /api/posts/:id - Actualizar post (requiere ser autor o admin)
 * - DELETE /api/posts/:id - Eliminar post (requiere ser autor o admin)
 */

import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postsController';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/posts
 * @desc    Obtener todos los posts (con filtros y paginación)
 * @access  Public
 * @query   ?status=published&fossil_type=bones_teeth&page=1&limit=10
 */
router.get('/', getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Obtener un post por ID
 * @access  Public (solo publicados) / Private (borradores propios o admin)
 */
router.get('/:id', getPostById);

/**
 * @route   POST /api/posts
 * @desc    Crear nuevo post
 * @access  Private (requiere autenticación)
 */
router.post('/', verifyToken, createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Actualizar un post
 * @access  Private (autor o admin)
 */
router.put('/:id', verifyToken, updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Eliminar un post (soft delete)
 * @access  Private (autor o admin)
 */
router.delete('/:id', verifyToken, deletePost);

export default router;

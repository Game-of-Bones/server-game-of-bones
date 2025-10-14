/**
 * MAIN ROUTER
 *
 * Punto de entrada central para todas las rutas de la API
 */

import express from 'express';
import authRouter from './routes/auth.routes';
import postsRouter from './routes/posts.routes';
import commentsRouter from './routes/comments.routes';
import likesRouter from './routes/likes.routes';

const router = express.Router();

/**
 * AUTH ROUTES
 * Base: /api/auth
 */
router.use('/auth', authRouter);

/**
 * POSTS ROUTES
 * Base: /api/posts
 */
router.use('/posts', postsRouter);

/**
 * COMMENTS ROUTES
 * Base: /api
 */
router.use('/', commentsRouter);

/**
 * LIKES ROUTES
 * Base: /api
 */
router.use('/', likesRouter);

export default router;

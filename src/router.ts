// src/router.ts
/**
 * ROUTER PRINCIPAL
 * Centraliza todas las rutas de la aplicación
 */

import express from 'express';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import fossilRoutes from './routes/posts';
import { createCommentsRouter } from './routes/comments';
import likesRouter from './routes/likes';

const router = express.Router();

// ============================================
// RUTAS ACTIVAS
// ============================================

// Rutas de autenticación (auth)
// POST /gameofbones/auth/register
// POST /gameofbones/auth/login
router.use('/auth', authRouter);

// Rutas de usuarios (User CRUD)
// GET    /gameofbones/users (lista usuarios - solo admin)
// GET    /gameofbones/users/:id (ver usuario)
// PUT    /gameofbones/users/:id (actualizar usuario)
// DELETE /gameofbones/users/:id (eliminar usuario)
// PATCH  /gameofbones/users/:id/role (cambiar rol - solo admin)
router.use('/users', usersRouter);

// Rutas de fósiles/posts (Post) - Gestiona tu compañera
// GET    /gameofbones/api/fossils
// POST   /gameofbones/api/fossils
// PUT    /gameofbones/api/fossils/:id
// DELETE /gameofbones/api/fossils/:id
router.use('/api/fossils', fossilRoutes);

// Rutas de comentarios (Comment)
// GET    /gameofbones/posts/:postId/comments
// POST   /gameofbones/posts/:postId/comments
// GET    /gameofbones/comments/:id
// PUT    /gameofbones/comments/:id
// DELETE /gameofbones/comments/:id
// GET    /gameofbones/users/:userId/comments
router.use(createCommentsRouter());

// Rutas de likes
// POST   /gameofbones/posts/:postId/like (toggle like)
// GET    /gameofbones/posts/:postId/likes
// GET    /gameofbones/users/:userId/likes
// GET    /gameofbones/posts/:postId/like/check
router.use(likesRouter);

export default router;
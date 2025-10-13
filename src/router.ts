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
import { createLikesRouter } from './routes/likes';

const router = express.Router();

// ============================================
// RUTAS ACTIVAS
// ============================================

// Rutas de autenticación (auth)
// POST /gameofbones/auth/register - Registrar nuevo usuario
// POST /gameofbones/auth/login - Iniciar sesión
router.use('/auth', authRouter);

// Rutas de usuarios (User CRUD)
// GET    /gameofbones/users - Lista de usuarios (solo admin)
// GET    /gameofbones/users/:id - Ver perfil de usuario
// PUT    /gameofbones/users/:id - Actualizar usuario
// DELETE /gameofbones/users/:id - Eliminar usuario
// PATCH  /gameofbones/users/:id/role - Cambiar rol (solo admin)
router.use('/users', usersRouter);

// Rutas de posts (Post CRUD)
// GET    /gameofbones/posts - Listar todos los posts
// POST   /gameofbones/posts - Crear nuevo post
// GET    /gameofbones/posts/:id - Ver post específico
// PUT    /gameofbones/posts/:id - Actualizar post
// DELETE /gameofbones/posts/:id - Eliminar post
router.use('/posts', fossilRoutes);

// Rutas de comentarios (Comment CRUD)
// GET    /gameofbones/comments - Listar todos los comentarios
// GET    /gameofbones/posts/:postId/comments - Comentarios de un post
// POST   /gameofbones/posts/:postId/comments - Crear comentario
// GET    /gameofbones/comments/:id - Ver comentario específico
// PUT    /gameofbones/comments/:id - Actualizar comentario
// DELETE /gameofbones/comments/:id - Eliminar comentario
// GET    /gameofbones/users/:userId/comments - Comentarios de un usuario
router.use(createCommentsRouter());

// Rutas de likes (Like)
// GET    /gameofbones/likes - Listar todos los likes
// POST   /gameofbones/posts/:postId/like - Toggle like en post
// GET    /gameofbones/posts/:postId/likes - Lista de likes de un post
// GET    /gameofbones/users/:userId/likes - Lista de likes de un usuario
// GET    /gameofbones/posts/:postId/like/check - Verificar si usuario dio like
router.use(createLikesRouter());

export default router;
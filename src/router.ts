import express from "express";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/users.routes";
import fossilRoutes from "./routes/GobRoutesPost"; //¿este fossilRoutes queda así?
import { createCommentsRouter } from "./routes/comments";
import likesRouter from "./routes/likes";


const router = express.Router();

// ============================================
// RUTAS ACTIVAS
// ============================================

// Rutas de autenticación (auth)
// Rutas: POST /gameofbones/auth/register, POST /gameofbones/auth/login
router.use('/auth', authRouter);

// Rutas de usuarios (User CRUD)
// Rutas:
// - GET /gameofbones/users (lista usuarios - solo admin)
// - GET /gameofbones/users/:id (ver usuario)
// - PUT /gameofbones/users/:id (actualizar usuario)
// - DELETE /gameofbones/users/:id (eliminar usuario)
// - PATCH /gameofbones/users/:id/role (cambiar rol - solo admin)
router.use('/users', usersRouter);


// Rutas de comentarios (Comment)
// Rutas:
// - GET/POST /gameofbones/posts/:postId/comments
// - GET/PUT/DELETE /gameofbones/comments/:id
// - GET /gameofbones/users/:userId/comments
router.use(createCommentsRouter());

// Rutas de fósiles/posts (Post)
// Rutas: GET, POST, PUT, DELETE /gameofbones/api/fossils
router.use("/api/fossils", fossilRoutes);

// ============================================
// RUTAS PENDIENTES
// ============================================

// router.use(likesRouter);       // ⏳ Pendiente: Likes

export default router;

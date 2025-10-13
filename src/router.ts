import express from "express";
import authRouter from "./routes/auth.routes";
import { createCommentsRouter } from "./routes/comments";

// import postsRouter from "./routes/posts";
// import usersRouter from "./routes/users";
import likesRouter from "./routes/likes";

const router = express.Router();

// ============================================
// RUTAS ACTIVAS
// ============================================

// Rutas de autenticación (User)
// Rutas: POST /gameofbones/auth/register, POST /gameofbones/auth/login
router.use('/auth', authRouter);

// Rutas de comentarios (Comment)
// Rutas:
// - GET/POST /gameofbones/posts/:postId/comments
// - GET/PUT/DELETE /gameofbones/comments/:id
// - GET /gameofbones/users/:userId/comments
router.use(createCommentsRouter());

// ============================================
// RUTAS PENDIENTES (de otros compañeros)
// ============================================

// router.use(postsRouter);      // ⏳ Pendiente: Posts
// router.use(likesRouter);       // ⏳ Pendiente: Likes

// 👇 Nueva línea: conecta las rutas de fósiles
router.use("/api/fossils", fossilRoutes);

export default router;

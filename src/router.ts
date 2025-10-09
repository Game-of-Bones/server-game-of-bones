import express from "express";
// import postsRouter from "./routes/posts";
// import usersRouter from "./routes/users";
import likesRouter from "./routes/likes";
import fossilRoutes from "./routes/GobRoutesPost"; // 👈 Añadido

const router = express.Router();

// router.use(postsRouter);
// router.use(usersRouter);
router.use(likesRouter);

// 👇 Nueva línea: conecta las rutas de fósiles
router.use("/api/fossils", fossilRoutes);

export default router;

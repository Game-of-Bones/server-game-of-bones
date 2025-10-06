import express from "express";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";
import likesRouter from "./routes/likes";

const router = express.Router();

router.use(postsRouter);
router.use(usersRouter);
router.use(likesRouter);

export default router;


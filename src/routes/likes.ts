import express from "express";
import {
  getLikesByPostId,
  toggleLike,
} from "../controllers/likesController";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

// Route to get the number of likes for a post
// This is a public route, no authentication needed
router.get("/api/posts/:postId/likes", getLikesByPostId);

// Route to add or remove a like from a post
// This is a protected route, the user must be authenticated
// The toggleLike controller handles both liking and unliking
router.post("/api/posts/:postId/like", verifyToken, toggleLike);

export default router;

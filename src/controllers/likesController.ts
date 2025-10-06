import { Request, Response, NextFunction } from "express";
import LikeManager from "../models/LikeManager";

// Create an instance of the manager that we will use in the controllers
const likeManager = new LikeManager();

/**
 * Gets the number of likes for a specific post.
 */
const getLikesByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const likeCount = await likeManager.findCountByPostId(postId);

    res.status(200).json({ count: likeCount });
  } catch (err) {
    next(err);
  }
};

/**
 * Adds or removes a like from a post.
 * If the user has already liked the post, the like is removed.
 * If not, it is added.
 */
const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    // We assume the user ID comes from the authentication middleware
    const userId = req.auth.id;

    // Check if the like already exists
    const existingLike = await likeManager.findUserLikeForPost(userId, postId);

    if (existingLike) {
      await likeManager.delete({ user_id: userId, post_id: postId });
      res.status(200).json({ message: "Like removed successfully" });
    } else {
      const result = await likeManager.add({ user_id: userId, post_id: postId });
      res.status(201).json({ insertId: result, message: "Like added successfully" });
    }
  } catch (err) {
    // Handle errors, such as a non-existent post_id, which would violate the FK
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(404).send("Post not found");
    } else {
      next(err);
    }
  }
};

export { getLikesByPostId, toggleLike };

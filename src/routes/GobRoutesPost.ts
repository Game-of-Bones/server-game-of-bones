import { Router } from "express";
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} from "../controllers/GobControllerPost";

const router = Router();

// 🔹 Ruta de prueba antes de /:id
router.get("/test", (req, res) => res.send("✅ Ruta de publicaciones activa"));

// CRUD
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;

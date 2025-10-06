//Route método Post 
import { Router } from "express";
import { createFossil } from "../controllers/GobControllerPost.js";

const router = Router();

// POST- crear Post/Entrada de fósil
router.post("/", createFossil);

export default router;

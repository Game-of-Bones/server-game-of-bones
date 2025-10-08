import { Router } from "express";
import { createFossil } from "../controllers/GobControllerPost";

const router = Router();

router.post("/", createFossil);

export default router;

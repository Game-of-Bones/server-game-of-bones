import { Router } from "express";
import { createFossil } from "../controllers/GobControllerPost";

const router = Router();

router.post("/", createFossil);

// Ruta de prueba opcional
router.get("/test", (req, res) => {
  res.send("✅ Ruta de fósiles activa");
});

export default router;

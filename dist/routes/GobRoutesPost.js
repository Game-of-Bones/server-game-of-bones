"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GobControllerPost_1 = require("../controllers/GobControllerPost");
const router = (0, express_1.Router)();
router.post("/", GobControllerPost_1.createFossil);
router.get("/", GobControllerPost_1.getAllFossils);
router.get("/:id", GobControllerPost_1.getFossilById);
router.put("/:id", GobControllerPost_1.updateFossil);
router.delete("/:id", GobControllerPost_1.deleteFossil);
// Ruta de prueba opcional
router.get("/test", (req, res) => {
    res.send("✅ Ruta de fósiles activa");
});
exports.default = router;
//# sourceMappingURL=GobRoutesPost.js.map
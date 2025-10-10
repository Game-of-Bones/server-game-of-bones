"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const GobRoutesPost_1 = __importDefault(require("./routes/GobRoutesPost")); //¿este fossilRoutes queda así?
const comments_1 = require("./routes/comments");
const router = express_1.default.Router();
// ============================================
// RUTAS ACTIVAS
// ============================================
// Rutas de autenticación (auth)
// Rutas: POST /gameofbones/auth/register, POST /gameofbones/auth/login
router.use('/auth', auth_routes_1.default);
// Rutas de usuarios (User CRUD)
// Rutas:
// - GET /gameofbones/users (lista usuarios - solo admin)
// - GET /gameofbones/users/:id (ver usuario)
// - PUT /gameofbones/users/:id (actualizar usuario)
// - DELETE /gameofbones/users/:id (eliminar usuario)
// - PATCH /gameofbones/users/:id/role (cambiar rol - solo admin)
router.use('/users', users_routes_1.default);
// Rutas de comentarios (Comment)
// Rutas:
// - GET/POST /gameofbones/posts/:postId/comments
// - GET/PUT/DELETE /gameofbones/comments/:id
// - GET /gameofbones/users/:userId/comments
router.use((0, comments_1.createCommentsRouter)());
// Rutas de fósiles/posts (Post)
// Rutas: GET, POST, PUT, DELETE /gameofbones/api/fossils
router.use("/api/fossils", GobRoutesPost_1.default);
// ============================================
// RUTAS PENDIENTES
// ============================================
// router.use(likesRouter);       // ⏳ Pendiente: Likes
exports.default = router;
//# sourceMappingURL=router.js.map
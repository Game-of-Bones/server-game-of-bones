"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentsRouter = createCommentsRouter;
const express_1 = require("express");
const commentsController_1 = require("../controllers/commentsController");
const auth_1 = require("../middleware/auth");
const commentValidation_1 = require("../middleware/commentValidation");
function createCommentsRouter() {
    const router = (0, express_1.Router)();
    // Obtener comentarios de un post (público)
    router.get('/posts/:postId/comments', commentsController_1.getCommentsByPost);
    // Crear comentario (requiere autenticación + validación)
    router.post('/posts/:postId/comments', auth_1.verifyToken, commentValidation_1.validateCreateComment, commentsController_1.createComment);
    // Ver un comentario específico (público)
    router.get('/comments/:id', commentsController_1.getCommentById);
    // Actualizar comentario (requiere autenticación + validación)
    router.put('/comments/:id', auth_1.verifyToken, commentValidation_1.validateUpdateComment, commentsController_1.updateComment);
    // Eliminar comentario (requiere autenticación)
    router.delete('/comments/:id', auth_1.verifyToken, commentsController_1.deleteComment);
    // Ver comentarios de un usuario (público)
    router.get('/users/:userId/comments', commentsController_1.getCommentsByUser);
    return router;
}
//# sourceMappingURL=comments.js.map
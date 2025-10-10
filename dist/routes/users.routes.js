"use strict";
// src/routes/users.routes.ts
// ⚠️ ESTE ARCHIVO DEBES CREARLO EN: src/routes/users.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const auth_1 = require("../middleware/auth");
const userValidation_1 = require("../middleware/userValidation");
const router = (0, express_1.Router)();
/**
 * @route   GET /gameofbones/users
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Private/Admin
 */
router.get('/', auth_1.verifyToken, auth_1.isAdmin, usersController_1.getAllUsers);
/**
 * @route   GET /gameofbones/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private (propio usuario o admin)
 */
router.get('/:id', auth_1.verifyToken, usersController_1.getUserById);
/**
 * @route   PUT /gameofbones/users/:id
 * @desc    Actualizar datos de usuario
 * @access  Private (propio usuario o admin)
 */
router.put('/:id', auth_1.verifyToken, userValidation_1.validateUpdateUser, usersController_1.updateUser);
/**
 * @route   DELETE /gameofbones/users/:id
 * @desc    Eliminar usuario (soft delete)
 * @access  Private (propio usuario o admin)
 */
router.delete('/:id', auth_1.verifyToken, usersController_1.deleteUser);
/**
 * @route   PATCH /gameofbones/users/:id/role
 * @desc    Cambiar rol de usuario (BONUS)
 * @access  Private/Admin
 */
router.patch('/:id/role', auth_1.verifyToken, auth_1.isAdmin, usersController_1.updateUserRole);
exports.default = router;
//# sourceMappingURL=users.routes.js.map
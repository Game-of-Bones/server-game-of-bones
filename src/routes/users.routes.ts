// src/routes/users.routes.ts
// ⚠️ ESTE ARCHIVO DEBES CREARLO EN: src/routes/users.routes.ts

import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} from '../controllers/usersController';
import { verifyToken, isAdmin } from '../middleware/auth';
import { validateUpdateUser } from '../middleware/userValidation';

const router = Router();

/**
 * @route   GET /gameofbones/users
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Private/Admin
 */
router.get('/', verifyToken, isAdmin, getAllUsers);

/**
 * @route   GET /gameofbones/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private (propio usuario o admin)
 */
router.get('/:id', verifyToken, getUserById);

/**
 * @route   PUT /gameofbones/users/:id
 * @desc    Actualizar datos de usuario
 * @access  Private (propio usuario o admin)
 */
router.put('/:id', verifyToken, validateUpdateUser, updateUser);

/**
 * @route   DELETE /gameofbones/users/:id
 * @desc    Eliminar usuario (soft delete)
 * @access  Private (propio usuario o admin)
 */
router.delete('/:id', verifyToken, deleteUser);

/**
 * @route   PATCH /gameofbones/users/:id/role
 * @desc    Cambiar rol de usuario (BONUS)
 * @access  Private/Admin
 */
router.patch('/:id/role', verifyToken, isAdmin, updateUserRole);

export default router;

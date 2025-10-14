/**
 * AUTH ROUTES
 *
 * Rutas de autenticación:
 * - POST /api/auth/register - Registrar usuario
 * - POST /api/auth/login - Iniciar sesión
 */

import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/userValidation';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', validateLogin, login);

export default router;

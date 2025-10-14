/**
 * AUTH CONTROLLER
 *
 * Maneja autenticación de usuarios:
 * - Registro de nuevos usuarios
 * - Login y generación de JWT
 */

import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/handleError';

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, role } = req.body;

    // Verificar si el email ya existe
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
      return;
    }

    // Verificar si el username ya existe
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      res.status(409).json({
        success: false,
        message: 'El username ya está en uso',
      });
      return;
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password_hash: password,
      role: role === 'admin' ? 'admin' : 'user',
    });
    // Línea 50-60 en register
    const jwtSecret: Secret = process.env.JWT_SECRET || 'secret';
    const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

    // @ts-ignore
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  }
);

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Verificar contraseña
    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Línea 105-115 en login
    const jwtSecret: Secret = process.env.JWT_SECRET || 'secret';
    const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

    // @ts-ignore
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  }
);

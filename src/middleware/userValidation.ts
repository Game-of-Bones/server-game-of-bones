// src/middleware/userValidation.ts
/**
 * MIDDLEWARE DE VALIDACIÓN PARA USUARIOS
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validar datos al actualizar un usuario
 */
export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  // Verificar que se envió al menos un campo
  if (!username && !email && !password) {
    res.status(400).json({
      success: false,
      message: 'Debes proporcionar al menos un campo para actualizar'
    });
    return;
  }

  // Validar username si está presente
  if (username !== undefined) {
    if (typeof username !== 'string' || username.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'El username debe tener al menos 3 caracteres'
      });
      return;
    }

    if (username.length > 50) {
      res.status(400).json({
        success: false,
        message: 'El username no puede exceder 50 caracteres'
      });
      return;
    }
  }

  // Validar email si está presente
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
      return;
    }

    if (email.length > 100) {
      res.status(400).json({
        success: false,
        message: 'El email no puede exceder 100 caracteres'
      });
      return;
    }
  }

  // Validar password si está presente
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    if (password.length > 128) {
      res.status(400).json({
        success: false,
        message: 'La contraseña no puede exceder 128 caracteres'
      });
      return;
    }
  }

  next();
};

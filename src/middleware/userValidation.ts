/**
 * MIDDLEWARE DE VALIDACIÓN PARA USUARIOS
 *
 * Valida los datos de entrada para:
 * - Registro de nuevos usuarios
 * - Login de usuarios
 * - Actualización de perfil
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validar datos de registro de usuario
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  // Campos requeridos
  if (!username || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Username, email y password son requeridos',
      errors: [
        !username && { field: 'username', message: 'Username es requerido' },
        !email && { field: 'email', message: 'Email es requerido' },
        !password && { field: 'password', message: 'Password es requerido' },
      ].filter(Boolean),
    });
    return;
  }

  // Validar username
  if (typeof username !== 'string' || username.trim().length < 3) {
    res.status(400).json({
      success: false,
      message: 'El username debe tener al menos 3 caracteres',
    });
    return;
  }

  if (username.length > 50) {
    res.status(400).json({
      success: false,
      message: 'El username no puede exceder 50 caracteres',
    });
    return;
  }

  // Validar que username no contenga espacios
  if (/\s/.test(username)) {
    res.status(400).json({
      success: false,
      message: 'El username no puede contener espacios',
    });
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Email inválido',
    });
    return;
  }

  if (email.length > 100) {
    res.status(400).json({
      success: false,
      message: 'El email no puede exceder 100 caracteres',
    });
    return;
  }

  // Validar password
  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres',
    });
    return;
  }

  if (password.length > 128) {
    res.status(400).json({
      success: false,
      message: 'La contraseña no puede exceder 128 caracteres',
    });
    return;
  }

  // Validar fuerza de contraseña (opcional pero recomendado)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      success: false,
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    });
    return;
  }

  next();
};

/**
 * Validar datos de login
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  // Campos requeridos
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email y password son requeridos',
    });
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Email inválido',
    });
    return;
  }

  // Validar que password no esté vacío
  if (typeof password !== 'string' || password.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Password no puede estar vacío',
    });
    return;
  }

  next();
};

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
      message: 'Debes proporcionar al menos un campo para actualizar',
    });
    return;
  }

  // Validar username si está presente
  if (username !== undefined) {
    if (typeof username !== 'string' || username.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'El username debe tener al menos 3 caracteres',
      });
      return;
    }

    if (username.length > 50) {
      res.status(400).json({
        success: false,
        message: 'El username no puede exceder 50 caracteres',
      });
      return;
    }

    // Validar que username no contenga espacios
    if (/\s/.test(username)) {
      res.status(400).json({
        success: false,
        message: 'El username no puede contener espacios',
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
        message: 'Email inválido',
      });
      return;
    }

    if (email.length > 100) {
      res.status(400).json({
        success: false,
        message: 'El email no puede exceder 100 caracteres',
      });
      return;
    }
  }

  // Validar password si está presente
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres',
      });
      return;
    }

    if (password.length > 128) {
      res.status(400).json({
        success: false,
        message: 'La contraseña no puede exceder 128 caracteres',
      });
      return;
    }

    // Validar fuerza de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        success: false,
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      });
      return;
    }
  }

  next();
};

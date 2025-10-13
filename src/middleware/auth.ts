/**
 * MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
 *
 * Proporciona middlewares para:
 * - Verificar tokens JWT
 * - Validar roles (admin/user)
 * - Validar ownership de recursos
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

/**
 * Interfaz para el payload del JWT
 */
interface JwtPayload {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Middleware para verificar el token JWT
 * Extrae el usuario del token y lo agrega a req.user
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
      return;
    }

    // El token viene en formato: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Formato de token inválido',
      });
      return;
    }

    // Verificar y decodificar el token usando la config centralizada
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    // Validar que el role es válido
    if (decoded.role !== 'admin' && decoded.role !== 'user') {
      res.status(401).json({
        success: false,
        message: 'Rol de usuario inválido',
      });
      return;
    }

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
      return;
    }

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error al verificar token',
    });
  }
};

/**
 * Middleware para verificar que el usuario es administrador
 * DEBE usarse DESPUÉS de verifyToken
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador',
    });
    return;
  }

  next();
};

/**
 * Middleware para verificar que el usuario es el propietario del recurso o es admin
 * Útil para endpoints como PUT /users/:id, DELETE /posts/:id
 */
export const isOwnerOrAdmin = (resourceIdParam: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    const resourceUserId = parseInt(req.params[resourceIdParam]);

    if (isNaN(resourceUserId)) {
      res.status(400).json({
        success: false,
        message: 'ID de recurso inválido',
      });
      return;
    }

    // Permitir si es admin o si es el propietario del recurso
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a este recurso',
    });
  };
};

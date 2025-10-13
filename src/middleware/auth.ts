// src/middleware/auth.ts
/**
 * MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
 * ✅ CORREGIDO: Type casting para role
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interfaz para el payload del JWT
 */
interface JwtPayload {
  id: number;
  role: 'admin' | 'user'; // ✅ Tipo estricto
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
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
      return;
    }

    // El token viene en formato: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
      return;
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    // ✅ CORRECCIÓN: Validar que el role es válido antes de asignarlo
    if (decoded.role !== 'admin' && decoded.role !== 'user') {
      res.status(401).json({
        success: false,
        message: 'Rol de usuario inválido'
      });
      return;
    }

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      role: decoded.role // ✅ Ahora TypeScript sabe que es 'admin' | 'user'
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error al verificar token'
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
  try {
    // Verificar que req.user existe (debería existir si verifyToken se ejecutó antes)
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Verificar que el rol es 'admin'
    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar permisos'
    });
  }
};

/**
 * Middleware opcional: verificar que el usuario es el propietario del recurso
 * o es admin
 */
export const isOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    const resourceUserId = parseInt(req.params.id || req.params.userId);

    // Permitir si es admin o si es el propietario del recurso
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a este recurso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar permisos'
    });
  }
};
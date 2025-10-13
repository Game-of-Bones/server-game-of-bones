/**
 * MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
 *
 * Captura y formatea todos los errores de la aplicación:
 * - Errores de validación de Sequelize
 * - Errores de constraints (unique, foreign key)
 * - Errores de JWT
 * - Errores personalizados
 * - Errores genéricos
 */

import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError
} from 'sequelize';

/**
 * Clase para errores personalizados de la aplicación
 */
export class AppError extends Error {
  status: number;
  errors?: any[];
  isOperational: boolean;

  constructor(message: string, status: number = 500, errors?: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.isOperational = true; // Indica que es un error esperado/manejable
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de manejo de errores
 * DEBE colocarse AL FINAL de todas las rutas en app.ts
 */
export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ ERROR CAPTURADO:');
    console.error('   Ruta:', req.method, req.path);
    console.error('   Tipo:', err.name);
    console.error('   Mensaje:', err.message);
    if (err.stack) console.error('   Stack:', err.stack);
  }

  // ============================================
  // ERRORES DE VALIDACIÓN DE SEQUELIZE
  // ============================================
  if (err instanceof ValidationError) {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));

    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
    return;
  }

  // ============================================
  // ERRORES DE CONSTRAINT ÚNICO (email/username duplicado)
  // ============================================
  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0]?.path || 'campo';
    const fieldTranslations: Record<string, string> = {
      email: 'correo electrónico',
      username: 'nombre de usuario',
    };

    res.status(409).json({
      success: false,
      message: `El ${fieldTranslations[field] || field} ya está en uso`,
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  // ============================================
  // ERRORES DE FOREIGN KEY (relaciones inexistentes)
  // ============================================
  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      success: false,
      message: 'Error de relación: el recurso referenciado no existe',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
    return;
  }

  // ============================================
  // ERRORES GENÉRICOS DE BASE DE DATOS
  // ============================================
  if (err instanceof DatabaseError) {
    res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
    return;
  }

  // ============================================
  // ERRORES JWT
  // ============================================
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
    return;
  }

  // ============================================
  // ERRORES PERSONALIZADOS (AppError)
  // ============================================
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // ============================================
  // ERROR GENÉRICO (500)
  // ============================================
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 * Debe colocarse ANTES de handleError pero DESPUÉS de todas las rutas
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

/**
 * Wrapper async para capturar errores en controladores
 * Evita el try-catch repetitivo
 *
 * Uso:
 * router.get('/posts', asyncHandler(getPosts));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

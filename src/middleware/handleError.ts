// src/middleware/handleError.ts
/**
 * MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
 * Captura y formatea errores de Sequelize, validación y genéricos
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

/**
 * Interfaz para errores personalizados
 */
interface CustomError extends Error {
  status?: number;
  errors?: any[];
}

/**
 * Middleware global de manejo de errores
 * Debe colocarse AL FINAL de todas las rutas en app.ts
 */
export const handleError = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ ERROR:', err);
  }

  // ============================================
  // ERRORES DE VALIDACIÓN DE SEQUELIZE
  // ============================================
  if (err instanceof ValidationError) {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));

    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
    return;
  }

  // ============================================
  // ERRORES DE CONSTRAINT ÚNICO (email/username duplicado)
  // ============================================
  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0]?.path || 'campo';
    
    res.status(409).json({
      success: false,
      message: `El ${field} ya está en uso`,
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
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
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  }

  // ============================================
  // ERRORES JWT
  // ============================================
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
    return;
  }

  // ============================================
  // ERRORES PERSONALIZADOS (con status code)
  // ============================================
  if (err.status) {
    res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
    return;
  }

  // ============================================
  // ERROR GENÉRICO (500)
  // ============================================
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

/**
 * Helper para crear errores personalizados
 */
export class AppError extends Error {
  status: number;
  errors?: any[];

  constructor(message: string, status: number = 500, errors?: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'AppError';
  }
}

/**
 * Wrapper async para capturar errores en controladores
 * Evita el try-catch repetitivo
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
/**
 * Middleware para validar la creación de comentarios
 * Se ejecuta ANTES de llegar al controller
 */
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export const validateCreateComment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { content } = req.body;

  // Validar que el contenido existe y es un string
  if (content === undefined || content === null) {
    res.status(400).json({
      success: false,
      errors: ['El contenido es requerido']
    });
    return;
  }

  if (typeof content !== 'string') {
    res.status(400).json({
      success: false,
      errors: ['El contenido debe ser texto']
    });
    return;
  }

  // Limpiar espacios
  const trimmedContent = content.trim();

  // Validar que existe contenido
  if (trimmedContent.length === 0) {
    errors.push('El contenido no puede estar vacío');
  }

  // Validar longitud máxima
  if (trimmedContent.length > 1000) {
    errors.push('El contenido no puede exceder los 1000 caracteres');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors
    });
    return;
  }

  // Sanitizar HTML manteniendo URLs y comillas legibles
  req.body.content = validator.escape(trimmedContent);

  next();
};

export const validateUpdateComment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = []; // Se agrega un array de errores
  const { content } = req.body;

  // Validar que el contenido existe y es un string
  if (content === undefined || content === null) {
    res.status(400).json({
      success: false,
      errors: ['El contenido es requerido'] // CAMBIO: 'error' a 'errors'
    });
    return;
  }

  if (typeof content !== 'string') {
    res.status(400).json({
      success: false,
      errors: ['El contenido debe ser texto'] // CAMBIO: 'error' a 'errors'
    });
    return;
  }

  // Limpiar espacios
  const trimmedContent = content.trim();

  // Validar que existe contenido
  if (trimmedContent.length === 0) {
    res.status(400).json({
      success: false,
      errors: ['El contenido no puede estar vacío'] // CAMBIO: 'error' a 'errors'
    });
    return;
  }

  // Validar longitud máxima
  if (trimmedContent.length > 1000) {
    res.status(400).json({
      success: false,
      errors: ['El contenido no puede exceder los 1000 caracteres'] // CAMBIO: 'error' a 'errors'
    });
    return;
  }

  // Sanitizar HTML
  req.body.content = validator.escape(trimmedContent);

  next();
};
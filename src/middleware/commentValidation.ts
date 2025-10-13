/**
 * MIDDLEWARE DE VALIDACIÓN PARA COMENTARIOS
 *
 * Valida y sanitiza el contenido de comentarios antes de procesarlos
 */

import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * Validar la creación de un comentario
 */
export const validateCreateComment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content } = req.body;

  // Validar que el contenido existe
  if (content === undefined || content === null) {
    res.status(400).json({
      success: false,
      message: 'El contenido es requerido',
    });
    return;
  }

  // Validar que es string
  if (typeof content !== 'string') {
    res.status(400).json({
      success: false,
      message: 'El contenido debe ser texto',
    });
    return;
  }

  // Limpiar espacios
  const trimmedContent = content.trim();

  // Validar que no está vacío
  if (trimmedContent.length === 0) {
    res.status(400).json({
      success: false,
      message: 'El contenido no puede estar vacío',
    });
    return;
  }

  // Validar longitud mínima (opcional pero recomendado)
  if (trimmedContent.length < 1) {
    res.status(400).json({
      success: false,
      message: 'El comentario debe tener al menos 1 caracter',
    });
    return;
  }

  // Validar longitud máxima (debe coincidir con el modelo: 5000)
  if (trimmedContent.length > 5000) {
    res.status(400).json({
      success: false,
      message: 'El comentario no puede exceder los 5000 caracteres',
    });
    return;
  }

  // Sanitizar HTML para prevenir XSS
  req.body.content = validator.escape(trimmedContent);

  next();
};

/**
 * Validar la actualización de un comentario
 */
export const validateUpdateComment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content } = req.body;

  // Validar que el contenido existe
  if (content === undefined || content === null) {
    res.status(400).json({
      success: false,
      message: 'El contenido es requerido',
    });
    return;
  }

  // Validar que es string
  if (typeof content !== 'string') {
    res.status(400).json({
      success: false,
      message: 'El contenido debe ser texto',
    });
    return;
  }

  // Limpiar espacios
  const trimmedContent = content.trim();

  // Validar que no está vacío
  if (trimmedContent.length === 0) {
    res.status(400).json({
      success: false,
      message: 'El contenido no puede estar vacío',
    });
    return;
  }

  // Validar longitud máxima (debe coincidir con el modelo: 5000)
  if (trimmedContent.length > 5000) {
    res.status(400).json({
      success: false,
      message: 'El comentario no puede exceder los 5000 caracteres',
    });
    return;
  }

  // Sanitizar HTML para prevenir XSS
  req.body.content = validator.escape(trimmedContent);

  next();
};

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar la creación de comentarios
 * Se ejecuta ANTES de llegar al controller
 */
export const validateCreateComment = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors: string[] = [];
  const { content } = req.body;

  // Validar que existe contenido
  if (!content || content.trim().length === 0) {
    errors.push('El contenido no puede estar vacío');
  }

  // Validar longitud máxima
  if (content && content.length > 1000) {
    errors.push('El contenido no puede exceder los 1000 caracteres');
  }

  // Si hay errores, retornar 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  // Sanitizar contenido (prevenir XSS)
  req.body.content = sanitizeContent(content);
  
  next();
};

/**
 * Middleware para validar actualización de comentarios
 */
export const validateUpdateComment = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'El contenido no puede estar vacío'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'El contenido no puede exceder los 1000 caracteres'
    });
  }

  req.body.content = sanitizeContent(content);
  next();
};

/**
 * Función helper para sanitizar contenido
 * Previene ataques XSS básicos
 */
function sanitizeContent(content: string): string {
  return content
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
/**
 * EXTENSIÓN DE TIPOS DE EXPRESS
 * 
 * Este archivo extiende los tipos de Express para añadir
 * propiedades personalizadas al objeto Request.
 * 
 * El middleware authenticate añade req.user, pero TypeScript
 * no lo sabe por defecto. Este archivo se lo indica.
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

// Esta línea es CRÍTICA - hace que el archivo sea un módulo
export {};
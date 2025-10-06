/**
 * EXTENSIÓN DE TIPOS DE EXPRESS
 * 
 * Este archivo extiende los tipos de Express para añadir
 * propiedades personalizadas al objeto Request.
 * 
 * El middleware authenticate añade req.user, pero TypeScript
 * no lo sabe por defecto. Este archivo se lo indica.
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
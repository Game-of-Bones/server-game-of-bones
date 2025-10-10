// src/types/express.d.ts
/**
 * EXTENSIONES DE TIPOS PARA EXPRESS
 * Agregar propiedades personalizadas al objeto Request
 */

import { User } from '../models/User';
import { Like } from '../models/Like';
import Fossil from '../models/GobModelPost';

declare global {
  namespace Express {
    interface Request {
      // Usuario autenticado (agregado por verifyToken)
      user?: {
        id: number;
        role: 'admin' | 'user';
      };

      // Post validado (agregado por middlewares de validación)
      post?: Fossil;

      // Like validado (agregado por middlewares de validación)
      like?: Like;

      // Paginación validada
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}

export {};
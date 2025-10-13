/**
 * EXTENSIÓN DE TIPOS DE EXPRESS
 *
 * Extiende el tipo Request de Express para incluir propiedades personalizadas
 * añadidas por middlewares de autenticación.
 *
 * req.user es añadido por el middleware authenticate() después de verificar el JWT
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'admin' | 'user';
      };
    }
  }
}

// Esta línea es CRÍTICA - convierte el archivo en un módulo TypeScript
export {};

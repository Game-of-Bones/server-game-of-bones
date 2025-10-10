import { Request, Response, NextFunction } from 'express';
/**
 * Middleware para verificar que el usuario está autenticado
 * Verifica el token JWT y añade la info del usuario al request
 */
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map
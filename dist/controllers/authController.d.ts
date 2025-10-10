import { Request, Response } from 'express';
/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export declare const register: (req: Request, res: Response) => Promise<void>;
/**
 * Iniciar sesión
 * POST /api/auth/login
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map
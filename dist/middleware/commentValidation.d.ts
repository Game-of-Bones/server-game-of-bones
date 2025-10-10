/**
 * Middleware para validar la creación de comentarios
 * Se ejecuta ANTES de llegar al controller
 */
import { Request, Response, NextFunction } from 'express';
export declare const validateCreateComment: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUpdateComment: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=commentValidation.d.ts.map
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar que el usuario está autenticado
 * Verifica el token JWT y añade la info del usuario al request
 */
export const verifyToken = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Añadir info del usuario al request
    (req as any).user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
}
/*Código MaricCarmen- probablemente se borrará  
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided - return 401
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // For development and testing, we'll attach a dummy user to the request.
  // The test user from schema.test.sql has id: 1.
  req.auth = { id: 1 };
  next();
};

*/
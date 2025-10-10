"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware para verificar que el usuario está autenticado
 * Verifica el token JWT y añade la info del usuario al request
 */
const verifyToken = (req, res, next) => {
    try {
        //console.log('🔍 NODE_ENV:', process.env.NODE_ENV); // <-- Añade esto
        //console.log('🔍 Token recibido:', req.headers.authorization); // <-- Y esto
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }
        // En entorno de testing, aceptar cualquier token y autenticar como usuario 1
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
            //console.log('✅ Modo desarrollo - autenticando como usuario 1');
            req.user = { id: 1, role: 'user' };
            return next();
        }
        // Verificar token JWT en producción/desarrollo
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Añadir info del usuario al request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido o expirado'
        });
    }
};
exports.verifyToken = verifyToken;
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
//# sourceMappingURL=auth.js.map
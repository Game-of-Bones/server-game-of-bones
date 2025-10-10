import { Request, Response } from 'express';
/**
 * Obtener todos los usuarios
 * GET /gameofbones/users
 */
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener usuario por ID
 * GET /gameofbones/users/:id
 */
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
/**
 * Actualizar usuario
 * PUT /gameofbones/users/:id
 */
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
/**
 * Eliminar usuario (soft delete)
 * DELETE /gameofbones/users/:id
 */
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
/**
 * Actualizar rol de usuario (BONUS)
 * PATCH /gameofbones/users/:id/role
 */
export declare const updateUserRole: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=usersController.d.ts.map
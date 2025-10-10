import { Request, Response } from "express";
/**
 * Crear un nuevo fósil/post
 * POST /gameofbones/api/fossils
 */
export declare const createFossil: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener todos los fósiles
 * GET /gameofbones/api/fossils
 */
export declare const getAllFossils: (req: Request, res: Response) => Promise<void>;
/**
 * Obtener un fósil por ID
 * GET /gameofbones/api/fossils/:id
 */
export declare const getFossilById: (req: Request, res: Response) => Promise<void>;
/**
 * Actualizar un fósil
 * PUT /gameofbones/api/fossils/:id
 */
export declare const updateFossil: (req: Request, res: Response) => Promise<void>;
/**
 * Eliminar un fósil (soft delete)
 * DELETE /gameofbones/api/fossils/:id
 */
export declare const deleteFossil: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=GobControllerPost.d.ts.map
// src/middleware/validator.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod'; 

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validación fallida',
          details: error,
        });
      }
      next(error);
    }
  };
};
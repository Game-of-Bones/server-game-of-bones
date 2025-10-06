import { Request, Response, NextFunction } from "express";

//----------IMPORTANT-------------------
//TEMPORAL CODE FOR TESTING PURPOSE!!!!!

// Placeholder for the real verifyToken middleware.
// This will be replaced with actual JWT verification logic.
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For development and testing, we'll attach a dummy user to the request.
  // The test user from schema.test.sql has id: 1.
  req.auth = { id: 1 };
  next();
};
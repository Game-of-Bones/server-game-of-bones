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
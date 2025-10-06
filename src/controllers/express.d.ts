// This file extends the Express Request interface to include the 'auth' property.

declare global {
  namespace Express {
    interface Request {
      auth: { id: number };
    }
  }
}
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const signToken = (payload: object) =>
  jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });

export const verifyToken = (token: string) =>
  jwt.verify(token, ENV.JWT_SECRET);
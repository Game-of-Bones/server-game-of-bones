// src/models/User.ts

/**
 * Interfaz principal del modelo User
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

/**
 * DTO para login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Respuesta de usuario (sin password)
 */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: Date;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// src/types/user.types.ts

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type UserRole = 'admin' | 'user';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at: Date;
}

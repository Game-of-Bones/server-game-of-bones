import pool from '../config/database';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const SALT_ROUNDS = 10;

// Tipos e interfaces
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

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: Date;
}

export const UserModel = {
  /**
   * Crear nuevo usuario con password hasheado
   */
  create: async (userData: CreateUserDto): Promise<UserResponse> => {
    const { username, email, password, role = 'user' } = userData;

    // Hash del password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [username, email, password_hash, role]
    );

    // Obtener el usuario creado
    const newUser = await UserModel.findById(result.insertId);
    if (!newUser) {
      throw new Error('Error al crear usuario');
    }

    return newUser;
  },

  /**
   * Buscar usuario por ID (excluye eliminados)
   */
  findById: async (id: number): Promise<UserResponse | null> => {
    const query = `
      SELECT id, username, email, role, created_at
      FROM users
      WHERE id = ? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as UserResponse;
  },

  /**
   * Buscar usuario por email (incluye password_hash para login)
   */
  findByEmail: async (email: string): Promise<User | null> => {
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users
      WHERE email = ? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  },

  /**
   * Buscar usuario por username
   */
  findByUsername: async (username: string): Promise<User | null> => {
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users
      WHERE username = ? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [username]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  },

  /**
   * Listar todos los usuarios (sin eliminados)
   */
  findAll: async (): Promise<UserResponse[]> => {
    const query = `
      SELECT id, username, email, role, created_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query);

    return rows as UserResponse[];
  },

  /**
   * Actualizar usuario
   */
  update: async (id: number, userData: UpdateUserDto): Promise<UserResponse | null> => {
    const updates: string[] = [];
    const values: any[] = [];

    if (userData.username) {
      updates.push('username = ?');
      values.push(userData.username);
    }

    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email);
    }

    if (userData.password) {
      const password_hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
      updates.push('password_hash = ?');
      values.push(password_hash);
    }

    if (userData.role) {
      updates.push('role = ?');
      values.push(userData.role);
    }

    if (updates.length === 0) {
      return UserModel.findById(id);
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ? AND deleted_at IS NULL
    `;

    await pool.execute(query, values);

    return UserModel.findById(id);
  },

  /**
   * Soft delete - marcar como eliminado
   */
  softDelete: async (id: number): Promise<boolean> => {
    const query = `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [id]);

    return result.affectedRows > 0;
  },

  /**
   * Comparar password en texto plano con hash
   */
  comparePassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Verificar si email ya existe
   */
  emailExists: async (email: string): Promise<boolean> => {
    const query = `
      SELECT id FROM users WHERE email = ? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);

    return rows.length > 0;
  },

  /**
   * Verificar si username ya existe
   */
  usernameExists: async (username: string): Promise<boolean> => {
    const query = `
      SELECT id FROM users WHERE username = ? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [username]);

    return rows.length > 0;
  }
};

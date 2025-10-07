import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { User, CreateUserDTO, UserResponse } from '../models/User';

export class UserRepository {
  constructor(private pool: Pool) {}

  // ==================== CREATE ====================

  /**
   * Crear un nuevo usuario
   */
  async create(data: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await this.pool.execute<ResultSetHeader>(
      query,
      [data.username, data.email, data.password, data.role || 'user']
    );

    // Obtener el usuario recién creado
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    return rows[0] as User;
  }

  // ==================== READ ====================

  /**
   * Buscar usuario por ID
   */
  async findById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    return rows[0] as User || null;
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );

    return rows[0] as User || null;
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
      [username]
    );

    return rows[0] as User || null;
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   */
  async findAll(limit = 50, offset = 0): Promise<UserResponse[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT id, username, email, role, created_at, updated_at
       FROM users
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows as UserResponse[];
  }

  /**
   * Contar total de usuarios
   */
  async count(): Promise<number> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL'
    );

    return rows[0].total;
  }

  /**
   * Obtener usuarios por rol
   */
  async findByRole(role: 'admin' | 'user'): Promise<UserResponse[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT id, username, email, role, created_at
       FROM users
       WHERE role = ? AND deleted_at IS NULL`,
      [role]
    );

    return rows as UserResponse[];
  }

  // ==================== UPDATE ====================

  /**
   * Actualizar rol de usuario
   */
  async updateRole(id: number, role: 'admin' | 'user'): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      [role, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Actualizar email de usuario
   */
  async updateEmail(id: number, email: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE users SET email = ?, updated_at = NOW() WHERE id = ?',
      [email, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Actualizar username
   */
  async updateUsername(id: number, username: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE users SET username = ?, updated_at = NOW() WHERE id = ?',
      [username, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Actualizar contraseña
   */
  async updatePassword(id: number, passwordHash: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [passwordHash, id]
    );

    return result.affectedRows > 0;
  }

  // ==================== DELETE ====================

  /**
   * Soft delete - marca como eliminado sin borrarlo realmente
   */
  async softDelete(id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE users SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Hard delete - elimina permanentemente
   */
  async hardDelete(id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  // ==================== VALIDACIONES ====================

  /**
   * Verificar si existe un email
   */
  async emailExists(email: string): Promise<boolean> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    return rows.length > 0;
  }

  /**
   * Verificar si existe un username
   */
  async usernameExists(username: string): Promise<boolean> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    return rows.length > 0;
  }

  /**
   * Verificar si un usuario es admin
   */
  async isAdmin(id: number): Promise<boolean> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [id]
    );

    return rows[0]?.role === 'admin';
  }
}

// Exportar instancia por defecto (singleton)
import pool from '../config/database';
export const userRepository = new UserRepository(pool);

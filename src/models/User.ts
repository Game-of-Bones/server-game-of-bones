// src/models/User.ts
/**
 * MODELO USER - SEQUELIZE-TYPESCRIPT CON DECORADORES
 */

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  Unique,
  AllowNull,
  Default,
  Length,
  IsEmail
} from 'sequelize-typescript';
import Fossil from './GobModelPost';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// ============================================
// MODELO USER CON DECORADORES
// ============================================

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Soft delete
  underscored: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'idx_users_email',
      unique: true,
      fields: ['email']
    },
    {
      name: 'idx_users_username',
      unique: true,
      fields: ['username']
    },
    {
      name: 'idx_users_role',
      fields: ['role']
    }
  ]
})
export class User extends Model {

  // ============================================
  // COLUMNAS
  // ============================================

  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del usuario'
  })
  declare id: number;

  @Unique({
    name: 'unique_username',
    msg: 'El username ya está en uso'
  })
  @Length({ min: 3, max: 50, msg: 'Username debe tener entre 3 y 50 caracteres' })
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    comment: 'Nombre de usuario único'
  })
  declare username: string;

  @Unique({
    name: 'unique_email',
    msg: 'El email ya está registrado'
  })
  @IsEmail
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    comment: 'Email del usuario'
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    comment: 'Contraseña hasheada con bcrypt'
  })
  declare password_hash: string;

  @Default('user')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('admin', 'user'),
    comment: 'Rol del usuario'
  })
  declare role: 'admin' | 'user';

  // ============================================
  // TIMESTAMPS
  // ============================================

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  declare updated_at: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at'
  })
  declare deleted_at: Date | null;

  // ============================================
  // RELACIONES
  // ============================================

  // Un usuario puede tener muchos posts
  @HasMany(() => Fossil, {
    foreignKey: 'author_id',
    as: 'posts'
  })
  declare posts?: Fossil[];

  // Un usuario puede tener muchos comentarios
  @HasMany(() => Comment, {
    foreignKey: 'user_id',
    as: 'comments'
  })
  declare comments?: Comment[];

  // Un usuario puede tener muchos likes
  @HasMany(() => Like, {
    foreignKey: 'user_id',
    as: 'likes'
  })
  declare likes?: Like[];

  // ============================================
  // MÉTODOS DE INSTANCIA (OPCIONAL)
  // ============================================

  /**
   * Devuelve el usuario sin el password_hash
   */
  toSafeObject(): UserResponse {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      created_at: this.created_at
    };
  }
}

export default User;

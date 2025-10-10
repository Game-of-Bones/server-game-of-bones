// src/models/User.ts
/**
 * MODELO USER - SEQUELIZE-TYPESCRIPT CON DECORADORES
 */

import 'reflect-metadata';
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
  IsEmail,
  AutoIncrement,
  PrimaryKey
} from 'sequelize-typescript';

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// ✅ Tipo para creación: id, created_at, updated_at, deleted_at son opcionales
export interface UserCreationAttributes {
  username: string;
  email: string;
  password_hash: string;
  role?: 'admin' | 'user';
}

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
  paranoid: true,
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
export class User extends Model<UserAttributes, UserCreationAttributes> {

  // ============================================
  // COLUMNAS
  // ============================================

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  declare id: number;

  @Unique({
    name: 'unique_username',
    msg: 'El username ya está en uso'
  })
  @Length({ min: 3, max: 50, msg: 'Username debe tener entre 3 y 50 caracteres' })
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare username: string;

  @Unique({
    name: 'unique_email',
    msg: 'El email ya está registrado'
  })
  @IsEmail
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password_hash: string;

  @Default('user')
  @AllowNull(false)
  @Column(DataType.ENUM('admin', 'user'))
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
  // RELACIONES (LAZY LOADING)
  // ============================================

  @HasMany(() => require('./GobModelPost').default, {
    foreignKey: 'author_id',
    as: 'posts'
  })
  declare posts?: any[];

  @HasMany(() => require('./Comment').Comment, {
    foreignKey: 'user_id',
    as: 'comments'
  })
  declare comments?: any[];

  @HasMany(() => require('./Like').Like, {
    foreignKey: 'user_id',
    as: 'likes'
  })
  declare likes?: any[];

  // ============================================
  // MÉTODOS DE INSTANCIA
  // ============================================

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

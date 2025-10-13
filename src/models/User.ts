/**
 * USER MODEL
 *
 * Modelo de usuario con autenticación
 * Roles: admin | user
 */

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// INTERFACES
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
// MODEL
// ============================================

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  password_hash!: string;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  role!: 'admin' | 'user';

  // ============================================
  // RELACIONES
  // ============================================

  @HasMany(() => Post)
  posts!: Post[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @HasMany(() => Like)
  likes!: Like[];

  // ============================================
  // HOOKS (Hasheo de contraseñas)
  // ============================================

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User): Promise<void> {
    // Solo hashear si la contraseña cambió
    if (user.changed('password_hash')) {
      const salt = await bcrypt.genSalt(12);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  }

  // ============================================
  // MÉTODOS DE INSTANCIA
  // ============================================

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  toJSON(): UserResponse {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.deleted_at;
    return values as UserResponse;
  }
}

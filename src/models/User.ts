// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/database';

// Atributos del modelo User
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

// Atributos opcionales al crear (id, timestamps)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

// Clase del modelo
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare role: 'admin' | 'user';
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date | null;

  // Timestamps automáticos
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Inicializar modelo
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete (usa deleted_at)
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true
  }
);

// DTOs (mantener las interfaces existentes)
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
/**
 * LIKE MODEL
 *
 * Modelo de likes en posts
 * Restricción: Un usuario solo puede dar 1 like por post (unique constraint)
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

// ============================================
// INTERFACES (DTOs)
// ============================================

export interface CreateLikeDTO {
  post_id: number;
  user_id: number;
}

export interface LikeResponse {
  id: number;
  post_id: number;
  user_id: number;
  created_at: Date;
}

// ============================================
// MODEL
// ============================================

@Table({
  tableName: 'likes',
  timestamps: true,
  paranoid: false, // Los likes no necesitan soft delete
  underscored: true,
  indexes: [
    {
      name: 'idx_likes_post_user',
      unique: true,
      fields: ['post_id', 'user_id'], // Un user solo puede dar 1 like por post
    },
    { name: 'idx_likes_post_id', fields: ['post_id'] },
    { name: 'idx_likes_user_id', fields: ['user_id'] },
  ],
})
export class Like extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  post_id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id!: number;

  // ============================================
  // RELACIONES
  // ============================================

  @BelongsTo(() => Post)
  post!: Post;

  @BelongsTo(() => User)
  user!: User;

  // ============================================
  // MÉTODOS DE INSTANCIA
  // ============================================

  toJSON(): LikeResponse {
    const values = { ...this.get() };
    delete values.updated_at; // Los likes no necesitan updated_at
    return values as LikeResponse;
  }
}

export default Like;

/**
 * COMMENT MODEL
 *
 * Modelo de comentarios en posts
 * Soporta soft delete y relaciones con User y Post
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

// ============================================
// INTERFACES (DTOs)
// ============================================

export interface CreateCommentDTO {
  content: string;
  post_id: number;
  user_id: number;
}

export interface UpdateCommentDTO {
  content?: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  author?: {
    id: number;
    username: string;
    email: string;
  };
}

// ============================================
// MODEL
// ============================================

@Table({
  tableName: 'comments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { name: 'idx_comments_post_id', fields: ['post_id'] },
    { name: 'idx_comments_user_id', fields: ['user_id'] },
    { name: 'idx_comments_created_at', fields: ['created_at'] },
  ],
})
export class Comment extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contenido no puede estar vacío',
      },
      len: {
        args: [1, 5000],
        msg: 'El comentario debe tener entre 1 y 5000 caracteres',
      },
    },
  })
  content!: string;

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
  author!: User;

  // ============================================
  // MÉTODOS DE INSTANCIA
  // ============================================

  toJSON(): CommentResponse {
    const values = { ...this.get() };
    delete values.deleted_at;
    return values as CommentResponse;
  }
}

export default Comment;

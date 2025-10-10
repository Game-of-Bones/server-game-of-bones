// src/models/Like.ts
/**
 * MODELO LIKE - SEQUELIZE-TYPESCRIPT CON DECORADORES
 */

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Unique
} from 'sequelize-typescript';
import { User } from './User';
import Fossil from './GobModelPost';

// ============================================
// MODELO LIKE CON DECORADORES
// ============================================

@Table({
  tableName: 'likes',
  timestamps: true,
  updatedAt: false, // ⚠️ IMPORTANTE: Likes no tienen updated_at
  underscored: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'unique_user_post_like',
      unique: true,
      fields: ['user_id', 'post_id']
    },
    {
      name: 'idx_likes_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_likes_post_id',
      fields: ['post_id']
    }
  ]
})
export class Like extends Model {

  // ============================================
  // COLUMNAS
  // ============================================

  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del like'
  })
  declare id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    comment: 'ID del usuario que dio like'
  })
  declare user_id: number;

  @ForeignKey(() => Fossil)
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    comment: 'ID del post al que se le dio like'
  })
  declare post_id: number;

  // ============================================
  // TIMESTAMPS
  // ============================================

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  declare created_at: Date;

  // ⚠️ NO HAY updated_at en likes

  // ============================================
  // RELACIONES
  // ============================================

  // Cada like pertenece a un usuario
  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    as: 'user'
  })
  declare user?: User;

  // Cada like pertenece a un post
  @BelongsTo(() => Fossil, {
    foreignKey: 'post_id',
    as: 'post'
  })
  declare post?: Fossil;
}

export default Like;

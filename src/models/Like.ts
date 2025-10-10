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
  AllowNull
} from 'sequelize-typescript';

// ⚠️ NO IMPORTAMOS los modelos relacionados aquí
// Las relaciones se definen con lazy loading

// ============================================
// INTERFACES
// ============================================

export interface LikeAttributes {
  id: number;
  user_id: number;
  post_id: number;
  created_at?: Date;
}

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
export class Like extends Model<LikeAttributes> {

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

  @ForeignKey(() => require('./User').User)
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    comment: 'ID del usuario que dio like'
  })
  declare user_id: number;

  @ForeignKey(() => require('./GobModelPost').default)
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
  // RELACIONES (LAZY LOADING)
  // ============================================

  // Cada like pertenece a un usuario
  @BelongsTo(() => require('./User').User, {
    foreignKey: 'user_id',
    as: 'user'
  })
  declare user?: any;

  // Cada like pertenece a un post
  @BelongsTo(() => require('./GobModelPost').default, {
    foreignKey: 'post_id',
    as: 'post'
  })
  declare post?: any;
}

export default Like;

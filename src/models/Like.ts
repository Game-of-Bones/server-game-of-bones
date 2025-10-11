// src/models/Like.ts
/**
 * MODELO LIKE - Sequelize-TypeScript con Decoradores
 * ✅ CORREGIDO: user_id y post_id ahora son BIGINT.UNSIGNED
 */

import 'reflect-metadata';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  Comment as SqComment,
  CreatedAt
} from 'sequelize-typescript';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface LikeAttributes {
  id: number;
  user_id: number;
  post_id: number;
  created_at?: Date;
}

export interface LikeCreationAttributes {
  user_id: number;
  post_id: number;
}

// ============================================
// MODELO LIKE CON DECORADORES
// ============================================

@Table({
  tableName: 'likes',
  modelName: 'Like',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false, // ⚠️ IMPORTANTE: Likes no tienen updated_at
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
export class Like extends Model<LikeAttributes, LikeCreationAttributes> {

  // ============================================
  // COLUMNAS
  // ============================================

  @SqComment('Identificador único del like')
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED) // ✅ CORREGIDO
  public id!: number;

  @SqComment('ID del usuario que dio like')
  @AllowNull(false)
  @ForeignKey(() => require('./User').User)
  @Column(DataType.BIGINT.UNSIGNED) // ✅ CORREGIDO: Era INTEGER.UNSIGNED
  public user_id!: number;

  @SqComment('ID del post al que se le dio like')
  @AllowNull(false)
  @ForeignKey(() => require('./Posts').default)
  @Column(DataType.BIGINT.UNSIGNED) // ✅ CORREGIDO: Era INTEGER.UNSIGNED
  public post_id!: number;

  // ============================================
  // TIMESTAMPS
  // ============================================

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  public readonly created_at!: Date;

  // ⚠️ NO HAY updated_at en likes

  // ============================================
  // RELACIONES (LAZY LOADING)
  // ============================================

  @BelongsTo(() => require('./User').User, {
    foreignKey: 'user_id',
    as: 'user'
  })
  public user?: any;

  @BelongsTo(() => require('./Posts').default, {
    foreignKey: 'post_id',
    as: 'post'
  })
  public post?: any;
}

export default Like;
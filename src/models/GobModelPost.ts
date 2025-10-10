// src/models/GobModelPost.ts
/**
 * MODELO FOSSIL (POST) - SEQUELIZE-TYPESCRIPT CON DECORADORES
 */

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
  Default,
  Length
} from 'sequelize-typescript';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// TIPOS
// ============================================

export type FossilType =
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

export type Status = 'draft' | 'published';

// ============================================
// MODELO FOSSIL CON DECORADORES
// ============================================

@Table({
  tableName: 'fossils',
  timestamps: true,
  paranoid: true, // Soft delete
  underscored: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'idx_fossils_author_id',
      fields: ['author_id']
    },
    {
      name: 'idx_fossils_status',
      fields: ['status']
    },
    {
      name: 'idx_fossils_fossil_type',
      fields: ['fossil_type']
    },
    {
      name: 'idx_fossils_created_at',
      fields: ['created_at']
    }
  ]
})
export class Fossil extends Model {

  // ============================================
  // COLUMNAS PRINCIPALES
  // ============================================

  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del fósil/post'
  })
  declare id: number;

  @Length({ min: 5, max: 255, msg: 'El título debe tener entre 5 y 255 caracteres' })
  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    comment: 'Título del descubrimiento'
  })
  declare title: string;

  @Length({ min: 10, max: 5000, msg: 'El resumen debe tener entre 10 y 5000 caracteres' })
  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    comment: 'Descripción del fósil'
  })
  declare summary: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'URL de la imagen principal'
  })
  declare image_url?: string | null;

  // ============================================
  // INFORMACIÓN DEL DESCUBRIMIENTO
  // ============================================

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Fecha del descubrimiento'
  })
  declare discovery_date?: Date | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Ubicación del hallazgo'
  })
  declare location?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Nombre del paleontólogo'
  })
  declare paleontologist?: string | null;

  @Default('bones_teeth')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      'bones_teeth',
      'shell_exoskeletons',
      'plant_impressions',
      'tracks_traces',
      'amber_insects'
    ),
    comment: 'Tipo de fósil encontrado'
  })
  declare fossil_type: FossilType;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Período geológico (ej: Cretácico Superior)'
  })
  declare geological_period?: string | null;

  // ============================================
  // AUTOR Y ESTADO
  // ============================================

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    comment: 'ID del usuario autor'
  })
  declare author_id: number;

  @Default('draft')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('draft', 'published'),
    comment: 'Estado de publicación'
  })
  declare status: Status;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Fuente de la información'
  })
  declare source?: string | null;

  // ============================================
  // TIMESTAMPS
  // ============================================

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at'
  })
  declare deletedAt: Date | null;

  // ============================================
  // RELACIONES
  // ============================================

  // Cada fósil pertenece a un usuario (autor)
  @BelongsTo(() => User, {
    foreignKey: 'author_id',
    as: 'author'
  })
  declare author?: User;

  // Un fósil puede tener muchos comentarios
  @HasMany(() => Comment, {
    foreignKey: 'post_id',
    as: 'comments'
  })
  declare comments?: Comment[];

  // Un fósil puede tener muchos likes
  @HasMany(() => Like, {
    foreignKey: 'post_id',
    as: 'likes'
  })
  declare likes?: Like[];
}

export default Fossil;

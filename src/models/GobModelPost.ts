// // src/models/GobModelPost.ts
// /**
//  * MODELO FOSSIL (POST) - SEQUELIZE-TYPESCRIPT CON DECORADORES
//  */

// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   CreatedAt,
//   UpdatedAt,
//   DeletedAt,
//   ForeignKey,
//   BelongsTo,
//   HasMany,
//   AllowNull,
//   Default,
//   Length
// } from 'sequelize-typescript';

// // ⚠️ NO IMPORTAMOS los modelos relacionados aquí
// // Las relaciones se definen con lazy loading

// // ============================================
// // TIPOS
// // ============================================

// export type FossilType =
//   | 'bones_teeth'
//   | 'shell_exoskeletons'
//   | 'plant_impressions'
//   | 'tracks_traces'
//   | 'amber_insects';

// export type Status = 'draft' | 'published';

// export interface FossilAttributes {
//   id: number;
//   title: string;
//   summary: string;
//   image_url?: string | null;
//   discovery_date?: Date | null;
//   location?: string | null;
//   paleontologist?: string | null;
//   fossil_type: FossilType;
//   geological_period?: string | null;
//   author_id: number;
//   status: Status;
//   source?: string | null;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }

// // ============================================
// // MODELO FOSSIL CON DECORADORES
// // ============================================

// @Table({
//   tableName: 'fossils',
//   timestamps: true,
//   paranoid: true, // Soft delete
//   underscored: true,
//   charset: 'utf8mb4',
//   collate: 'utf8mb4_unicode_ci',
//   indexes: [
//     {
//       name: 'idx_fossils_author_id',
//       fields: ['author_id']
//     },
//     {
//       name: 'idx_fossils_status',
//       fields: ['status']
//     },
//     {
//       name: 'idx_fossils_fossil_type',
//       fields: ['fossil_type']
//     },
//     {
//       name: 'idx_fossils_created_at',
//       fields: ['created_at']
//     }
//   ]
// })
// export class Fossil extends Model<FossilAttributes> {

//   // ============================================
//   // COLUMNAS PRINCIPALES
//   // ============================================

//   @Column({
//     type: DataType.BIGINT.UNSIGNED,
//     primaryKey: true,
//     autoIncrement: true,
//     comment: 'ID único del fósil/post'
//   })
//   declare id: number;

//   @Length({ min: 5, max: 255, msg: 'El título debe tener entre 5 y 255 caracteres' })
//   @AllowNull(false)
//   @Column({
//     type: DataType.STRING(255),
//     comment: 'Título del descubrimiento'
//   })
//   declare title: string;

//   @Length({ min: 10, max: 5000, msg: 'El resumen debe tener entre 10 y 5000 caracteres' })
//   @AllowNull(false)
//   @Column({
//     type: DataType.TEXT,
//     comment: 'Descripción del fósil'
//   })
//   declare summary: string;

//   @Column({
//     type: DataType.STRING(500),
//     allowNull: true,
//     comment: 'URL de la imagen principal'
//   })
//   declare image_url?: string | null;

//   // ============================================
//   // INFORMACIÓN DEL DESCUBRIMIENTO
//   // ============================================

//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//     comment: 'Fecha del descubrimiento'
//   })
//   declare discovery_date?: Date | null;

//   @Column({
//     type: DataType.STRING(255),
//     allowNull: true,
//     comment: 'Ubicación del hallazgo'
//   })
//   declare location?: string | null;

//   @Column({
//     type: DataType.STRING(255),
//     allowNull: true,
//     comment: 'Nombre del paleontólogo'
//   })
//   declare paleontologist?: string | null;

//   @Default('bones_teeth')
//   @AllowNull(false)
//   @Column({
//     type: DataType.ENUM(
//       'bones_teeth',
//       'shell_exoskeletons',
//       'plant_impressions',
//       'tracks_traces',
//       'amber_insects'
//     ),
//     comment: 'Tipo de fósil encontrado'
//   })
//   declare fossil_type: FossilType;

//   @Column({
//     type: DataType.STRING(100),
//     allowNull: true,
//     comment: 'Período geológico (ej: Cretácico Superior)'
//   })
//   declare geological_period?: string | null;

//   // ============================================
//   // AUTOR Y ESTADO
//   // ============================================

//   @ForeignKey(() => require('./User').User)
//   @AllowNull(false)
//   @Column({
//     type: DataType.BIGINT.UNSIGNED,
//     comment: 'ID del usuario autor'
//   })
//   declare author_id: number;

//   @Default('draft')
//   @AllowNull(false)
//   @Column({
//     type: DataType.ENUM('draft', 'published'),
//     comment: 'Estado de publicación'
//   })
//   declare status: Status;

//   @Column({
//     type: DataType.STRING(500),
//     allowNull: true,
//     comment: 'Fuente de la información'
//   })
//   declare source?: string | null;

//   // ============================================
//   // TIMESTAMPS
//   // ============================================

//   @CreatedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'created_at'
//   })
//   declare createdAt: Date;

//   @UpdatedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'updated_at'
//   })
//   declare updatedAt: Date;

//   @DeletedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'deleted_at'
//   })
//   declare deletedAt: Date | null;

//   // ============================================
//   // RELACIONES (LAZY LOADING)
//   // ============================================

//   // Cada fósil pertenece a un usuario (autor)
//   @BelongsTo(() => require('./User').User, {
//     foreignKey: 'author_id',
//     as: 'author'
//   })
//   declare author?: any;

//   // Un fósil puede tener muchos comentarios
//   @HasMany(() => require('./Comment').Comment, {
//     foreignKey: 'post_id',
//     as: 'comments'
//   })
//   declare comments?: any[];

//   // Un fósil puede tener muchos likes
//   @HasMany(() => require('./Like').Like, {
//     foreignKey: 'post_id',
//     as: 'likes'
//   })
//   declare likes?: any[];
// }

// export default Fossil;

// src/models/GobModelPost.ts
/**
 * MODELO FOSSIL (POST) - SEQUELIZE-TYPESCRIPT CON DECORADORES
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
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
  Default,
  Length,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript';

// ⚠️ NO IMPORTAMOS los modelos relacionados aquí
// Las relaciones se definen con lazy loading

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

// Atributos completos del modelo
export interface FossilAttributes {
  id: number;
  title: string;
  summary: string;
  image_url?: string | null;
  discovery_date?: Date | null;
  location?: string | null;
  paleontologist?: string | null;
  fossil_type: FossilType;
  geological_period?: string | null;
  author_id: number;
  status: Status;
  source?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// ✅ Atributos para creación (sin id ni timestamps)
export interface FossilCreationAttributes {
  title: string;
  summary: string;
  image_url?: string | null;
  discovery_date?: Date | null;
  location?: string | null;
  paleontologist?: string | null;
  fossil_type?: FossilType;
  geological_period?: string | null;
  author_id: number;
  status?: Status;
  source?: string | null;
}

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
export class Fossil extends Model<FossilAttributes, FossilCreationAttributes> {

  // ============================================
  // COLUMNAS PRINCIPALES
  // ============================================

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  declare id: number;

  @Length({ min: 5, max: 255, msg: 'El título debe tener entre 5 y 255 caracteres' })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare title: string;

  @Length({ min: 10, max: 5000, msg: 'El resumen debe tener entre 10 y 5000 caracteres' })
  @AllowNull(false)
  @Column(DataType.TEXT)
  declare summary: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true
  })
  declare image_url?: string | null;

  // ============================================
  // INFORMACIÓN DEL DESCUBRIMIENTO
  // ============================================

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare discovery_date?: Date | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  declare location?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  declare paleontologist?: string | null;

  @Default('bones_teeth')
  @AllowNull(false)
  @Column(DataType.ENUM(
    'bones_teeth',
    'shell_exoskeletons',
    'plant_impressions',
    'tracks_traces',
    'amber_insects'
  ))
  declare fossil_type: FossilType;

  @Column({
    type: DataType.STRING(100),
    allowNull: true
  })
  declare geological_period?: string | null;

  // ============================================
  // AUTOR Y ESTADO
  // ============================================

  @ForeignKey(() => require('./User').User)
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare author_id: number;

  @Default('draft')
  @AllowNull(false)
  @Column(DataType.ENUM('draft', 'published'))
  declare status: Status;

  @Column({
    type: DataType.STRING(500),
    allowNull: true
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
  // RELACIONES (LAZY LOADING)
  // ============================================

  // Cada fósil pertenece a un usuario (autor)
  @BelongsTo(() => require('./User').User, {
    foreignKey: 'author_id',
    as: 'author'
  })
  declare author?: any;

  // Un fósil puede tener muchos comentarios
  @HasMany(() => require('./Comment').Comment, {
    foreignKey: 'post_id',
    as: 'comments'
  })
  declare comments?: any[];

  // Un fósil puede tener muchos likes
  @HasMany(() => require('./Like').Like, {
    foreignKey: 'post_id',
    as: 'likes'
  })
  declare likes?: any[];
}

export default Fossil;

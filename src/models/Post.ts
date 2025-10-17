/**
 * POST MODEL (Fossil Discoveries)
 *
 * Modelo de posts sobre descubrimientos paleontológicos
 * Tipos de fósiles soportados: huesos, plantas, insectos, etc.
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// TYPES
// ============================================

export type FossilType =
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

export type PostStatus = 'draft' | 'published';

// ============================================
// INTERFACES (DTOs)
// ============================================

export interface CreatePostDTO {
  title: string;
  summary: string;
  post_content: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  user_id: number;
  status?: PostStatus;
  source?: string;
}

export interface UpdatePostDTO {
  title?: string;
  summary?: string;
  post_content?: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  paleontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  status?: PostStatus;
  source?: string;
}

export interface PostResponse {
  id: number;
  title: string;
  summary: string;
  post_content: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  user_id: number;
  status: PostStatus;
  source?: string;
  created_at: Date;
  updated_at: Date;
  author?: {
    id: number;
    username: string;
    email: string;
  };
  comments_count?: number;
  likes_count?: number;
}

// ============================================
// MODEL
// ============================================

@Table({
  tableName: 'posts',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Post extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 255],
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [20, 1000],
    },
  })
  summary!: string;

  // ✅ CAMPO NUEVO: post_content (contenido detallado del post)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [50, 10000], // Contenido más extenso que el summary
    },
  })
  post_content!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
    validate: {
      isUrl: true,
    },
  })
  image_url?: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  discovery_date?: Date;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  location?: string;

  @AllowNull(true)
  @Column(DataType.DECIMAL(10, 8))
  latitude?: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(11, 8))
  longitude?: number;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  paleontologist?: string;

  @Default('bones_teeth')
  @Column({
    type: DataType.ENUM(
      'bones_teeth',
      'shell_exoskeletons',
      'plant_impressions',
      'tracks_traces',
      'amber_insects'
    ),
    allowNull: false,
  })
  fossil_type!: FossilType;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  geological_period?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id!: number;

  @Default('draft')
  @Column({
    type: DataType.ENUM('draft', 'published'),
    allowNull: false,
  })
  status!: PostStatus;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  source?: string;

  // ============================================
  // RELACIONES
  // ============================================

  @BelongsTo(() => User)
  author!: User;

  @HasMany(() => Comment)
  comments!: Comment[];

  @HasMany(() => Like)
  likes!: Like[];

  // ============================================
  // MÉTODOS DE INSTANCIA
  // ============================================

  async getLikesCount(): Promise<number> {
    return await Like.count({ where: { post_id: this.id } });
  }

  async getCommentsCount(): Promise<number> {
    return await Comment.count({ where: { post_id: this.id } });
  }

  toJSON(): PostResponse {
    return {
      id: this.id,
      title: this.title,
      summary: this.summary,
      post_content: this.post_content, // ✅ Ahora se incluye explícitamente
      image_url: this.image_url,
      discovery_date: this.discovery_date,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      paleontologist: this.paleontologist,
      fossil_type: this.fossil_type,
      geological_period: this.geological_period,
      user_id: this.user_id,
      status: this.status,
      source: this.source,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

export default Post;

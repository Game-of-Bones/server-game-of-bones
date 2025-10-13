import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

export type FossilType =
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

export type PostStatus = 'draft' | 'published';

@Table({
  tableName: 'posts', // ← Ahora consistente: posts en BD
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  summary!: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  image_url?: string | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  discovery_date?: Date | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  location?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  paleontologist?: string | null;

  // Este campo es específico para fósiles, pero el modelo sigue siendo Post
  @AllowNull(false)
  @Default('bones_teeth')
  @Column(
    DataType.ENUM(
      'bones_teeth',
      'shell_exoskeletons',
      'plant_impressions',
      'tracks_traces',
      'amber_insects'
    )
  )
  fossil_type!: FossilType;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  geological_period?: string | null;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  author_id!: number;

  @AllowNull(false)
  @Default('draft')
  @Column(DataType.ENUM('draft', 'published'))
  status!: PostStatus;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  source?: string | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt!: Date | null;

  // Relaciones
  @BelongsTo(() => User, { foreignKey: 'author_id', as: 'author' })
  author!: User;

  @HasMany(() => Comment, { foreignKey: 'post_id', as: 'comments' })
  comments!: Comment[];

  @HasMany(() => Like, { foreignKey: 'post_id', as: 'likes' })
  likes!: Like[];
}

export default Post;

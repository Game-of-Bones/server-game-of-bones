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
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { User } from "./User"; 

export type FossilType =
  | "bones_teeth"
  | "shell_exoskeletons"
  | "plant_impressions"
  | "tracks_traces"
  | "amber_insects";

export type Status = "draft" | "published";

interface PostAttributes {
  id: number;
  title: string;
  summary: string;
  post_content: string;
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

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    | "id"
    | "image_url"
    | "discovery_date"
    | "location"
    | "paleontologist"
    | "geological_period"
    | "status"
    | "source"
    | "deletedAt"
  > {}

@Table({
  tableName: "post",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Post extends Model<PostAttributes, PostCreationAttributes> {
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

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  post_content!: string;

  @Column(DataType.STRING(500))
  image_url?: string | null;

  @Column(DataType.DATE)
  discovery_date?: Date | null;

  @Column(DataType.STRING(255))
  location?: string | null;

  @Column(DataType.STRING(255))
  paleontologist?: string | null;

  @AllowNull(false)
  @Default("bones_teeth")
  @Column(
    DataType.ENUM(
      "bones_teeth",
      "shell_exoskeletons",
      "plant_impressions",
      "tracks_traces",
      "amber_insects"
    )
  )
  fossil_type!: FossilType;

  @Column(DataType.STRING(100))
  geological_period?: string | null;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  author_id!: number;

  @AllowNull(false)
  @Default("draft")
  @Column(DataType.ENUM("draft", "published"))
  status!: Status;

  @Column(DataType.STRING(500))
  source?: string | null;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date | null;

  @BelongsTo(() => User)
  author!: User;
}

export default Post;

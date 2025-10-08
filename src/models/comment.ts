import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CommentAttributes {
  id: bigint;
  post_id: bigint;
  user_id: bigint;
  content: string;
  parent_id?: bigint | null;
  created_at?: Date;
  updated_at?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'parent_id' | 'created_at' | 'updated_at'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: bigint;
  public post_id!: bigint;
  public user_id!: bigint;
  public content!: string;
  public parent_id!: bigint | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    underscored: true,
  }
);

export default Comment;
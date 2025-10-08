import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// --- 1. Definición de Tipos ---

// Atributos que existen en la tabla SQL
interface CommentAttributes {
  id: number;           
  post_id: number;      
  user_id: number;      
  content: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Atributos para la creación
interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

// --- 2. Implementación del Modelo ---

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public post_id!: number;
  public user_id!: number;
  public content!: string;

  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

// --- 3. Inicialización del Esquema ---

Comment.init(
  {
      id: {
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true,
          autoIncrement: true,
          comment: 'Identificador único del comentario',
      },
      post_id: {
          type: DataTypes.INTEGER.UNSIGNED, 
          allowNull: false,
          comment: 'ID del post al que pertenece el comentario',
      },
      user_id: {
          type: DataTypes.INTEGER.UNSIGNED, 
          allowNull: false,
          comment: 'ID del usuario que hizo el comentario',
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: 'Contenido del comentario',
          validate: {
              notEmpty: {
                  msg: 'El contenido no puede estar vacío'
              },
              len: {
                  args: [1, 5000],
                  msg: 'El comentario debe tener entre 1 y 5000 caracteres'
              }
          }
      },
  },
  {
      sequelize,
      tableName: 'comments',
      modelName: 'Comment',
      timestamps: true,
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      
      // Índices para mejorar rendimiento
      indexes: [
          {
              name: 'idx_comments_post_id',
              fields: ['post_id']
          },
          {
              name: 'idx_comments_user_id',
              fields: ['user_id']
          },
          {
              name: 'idx_comments_created_at',
              fields: ['created_at']
          }
      ]
  }
);

export default Comment;
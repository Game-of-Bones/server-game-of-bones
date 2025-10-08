import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// --- 1. Definición de Tipos ---

// Atributos que existen en la tabla SQL
interface CommentAttributes {
  id: bigint;
  post_id: bigint;
  user_id: bigint;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null; // Para soft delete
}

// Atributos para la creación (id, y timestamps son opcionales al crear)
interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

// --- 2. Implementación del Modelo ---

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: bigint;
  public post_id!: bigint;
  public user_id!: bigint;
  public content!: string;

  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null; // Usado por paranoid: true
}

// --- 3. Inicialización del Esquema ---

Comment.init(
  {
      id: {
          type: DataTypes.BIGINT.UNSIGNED, // Coincide con BIGINT UNSIGNED
          primaryKey: true,
          autoIncrement: true,
          comment: 'Identificador único del comentario',
      },
      post_id: {
          type: DataTypes.BIGINT.UNSIGNED, // Usamos UNSIGNED para uniformidad con 'id'
          allowNull: false,
          comment: 'ID del post al que pertenece el comentario',
          // Las referencias fk_comments_post se configurarán en src/models/index.ts
          // para evitar errores de referencia circular si post.ts aún no está disponible.
      },
      user_id: {
          type: DataTypes.BIGINT.UNSIGNED, // Usamos UNSIGNED para uniformidad con 'id'
          allowNull: false,
          comment: 'ID del usuario que hizo el comentario',
          // Las referencias fk_comments_user se configurarán en src/models/index.ts
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: 'Contenido del comentario',
      },
  },
  {
      sequelize,
      tableName: 'comments',
      modelName: 'Comment',
      // Opciones de Soft Delete y Nombres de Columna
      timestamps: true, // Mapea a created_at y updated_at
      underscored: true, // Usa snake_case (post_id en lugar de postId)
      paranoid: true, // Habilita soft delete, usando la columna `deleted_at`
      deletedAt: 'deleted_at', // Especifica el nombre de la columna para soft delete
      
      // Configuraciones de MySQL
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
  }
);

export default Comment;

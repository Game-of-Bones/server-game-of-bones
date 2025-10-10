// src/models/Like.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/database';

// --- 1. Definición de Tipos ---

// Atributos que existen en la tabla SQL
export interface LikeAttributes {
  id: number;
  user_id: number;
  post_id: number;
  created_at?: Date;
}

// Atributos para la creación
export interface LikeCreationAttributes
  extends Optional<LikeAttributes, 'id' | 'created_at'> {}

// --- 2. Implementación del Modelo ---

export class Like extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes {
  public id!: number;
  public user_id!: number;
  public post_id!: number;

  // Timestamp
  public readonly created_at!: Date;
}

// --- 3. Inicialización del Esquema ---

Like.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del like',
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'ID del usuario que dio like',
    },
    post_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'ID del post al que se le dio like',
    },
  },
  {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
    timestamps: true,        // Solo created_at
    updatedAt: false,        // ⬅️ IMPORTANTE: No hay updated_at en likes
    underscored: true,
    createdAt: 'created_at',

    // Índices únicos y de rendimiento
    indexes: [
      {
        // ⬅️ CRÍTICO: Un usuario solo puede dar like una vez por post
        unique: true,
        fields: ['user_id', 'post_id'],
        name: 'unique_user_post_like'
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
  }
);

// --- 4. Exportación ---
// ✅ Solo export default (evita conflictos)
export default Like;

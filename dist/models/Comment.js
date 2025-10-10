"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
// --- 2. Implementación del Modelo ---
class Comment extends sequelize_1.Model {
}
exports.Comment = Comment;
// --- 3. Inicialización del Esquema ---
Comment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del comentario',
    },
    post_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'ID del post al que pertenece el comentario',
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'ID del usuario que hizo el comentario',
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
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
}, {
    sequelize: database_1.default,
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
});
//# sourceMappingURL=Comment.js.map
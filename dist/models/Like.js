"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
// src/models/Like.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
// --- 2. Implementación del Modelo ---
class Like extends sequelize_1.Model {
}
exports.Like = Like;
// --- 3. Inicialización del Esquema ---
Like.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del like',
    },
    user_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: 'ID del usuario que dio like',
    },
    post_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: 'ID del post al que se le dio like',
    },
}, {
    sequelize: database_1.default,
    tableName: 'likes',
    modelName: 'Like',
    timestamps: true, // Solo created_at
    updatedAt: false, // ⬅️ IMPORTANTE: No hay updated_at en likes
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
});
exports.default = Like;
//# sourceMappingURL=Like.js.map
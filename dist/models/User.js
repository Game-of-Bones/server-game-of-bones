"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
// Clase del modelo
class User extends sequelize_1.Model {
}
exports.User = User;
// Inicializar modelo
User.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'created_at'
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at'
    },
    deleted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
    }
}, {
    sequelize: database_1.default,
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete (usa deleted_at)
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true
});
//# sourceMappingURL=User.js.map
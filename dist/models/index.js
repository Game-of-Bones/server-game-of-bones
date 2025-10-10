"use strict";
// src/models/index.ts
/**
 * MODELS INDEX - Configuración y relaciones
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Like = exports.Comment = exports.Fossil = exports.User = exports.sequelize = exports.syncDatabase = exports.setupAssociations = void 0;
const database_1 = __importDefault(require("../database/database"));
exports.sequelize = database_1.default;
const Comment_1 = require("./Comment");
Object.defineProperty(exports, "Comment", { enumerable: true, get: function () { return Comment_1.Comment; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const GobModelPost_1 = __importDefault(require("./GobModelPost")); // El modelo Post/Fossil
exports.Fossil = GobModelPost_1.default;
const Like_1 = require("./Like");
Object.defineProperty(exports, "Like", { enumerable: true, get: function () { return Like_1.Like; } });
// ============================================
// FUNCIÓN DE CONFIGURACIÓN DE RELACIONES
// ============================================
/**
 * Configura las asociaciones (relaciones) entre los modelos de Sequelize.
 * Se llama desde server.ts después de autenticar la conexión a DB.
 */
const setupAssociations = () => {
    console.log('🔗 Configurando asociaciones de modelos...');
    // ============================================
    // RELACIÓN: User <-> Fossil (Post)
    // users → posts (1:N) via author_id
    // ============================================
    User_1.User.hasMany(GobModelPost_1.default, {
        foreignKey: 'author_id',
        as: 'posts'
    });
    GobModelPost_1.default.belongsTo(User_1.User, {
        foreignKey: 'author_id',
        as: 'author'
    });
    // ============================================
    // RELACIÓN: User <-> Comment
    // users → comments (1:N) via user_id
    // ============================================
    User_1.User.hasMany(Comment_1.Comment, {
        foreignKey: 'user_id',
        as: 'comments'
    });
    Comment_1.Comment.belongsTo(User_1.User, {
        foreignKey: 'user_id',
        as: 'author'
    });
    // ============================================
    // RELACIÓN: Fossil (Post) <-> Comment
    // posts → comments (1:N) via post_id
    // ============================================
    GobModelPost_1.default.hasMany(Comment_1.Comment, {
        foreignKey: 'post_id',
        as: 'comments'
    });
    Comment_1.Comment.belongsTo(GobModelPost_1.default, {
        foreignKey: 'post_id',
        as: 'post'
    });
    // ============================================
    // RELACIÓN: User <-> Like
    // users → likes (1:N) via user_id
    // ============================================
    User_1.User.hasMany(Like_1.Like, {
        foreignKey: 'user_id',
        as: 'likes'
    });
    Like_1.Like.belongsTo(User_1.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    // ============================================
    // RELACIÓN: Fossil (Post) <-> Like
    // posts → likes (1:N) via post_id
    // ============================================
    GobModelPost_1.default.hasMany(Like_1.Like, {
        foreignKey: 'post_id',
        as: 'likes'
    });
    Like_1.Like.belongsTo(GobModelPost_1.default, {
        foreignKey: 'post_id',
        as: 'post'
    });
    console.log('✅ Asociaciones configuradas:');
    console.log('   - User <-> Fossil (Post)');
    console.log('   - User <-> Comment');
    console.log('   - Fossil (Post) <-> Comment');
    console.log('   - User <-> Like');
    console.log('   - Fossil (Post) <-> Like');
};
exports.setupAssociations = setupAssociations;
// ============================================
// SINCRONIZAR BASE DE DATOS (Función auxiliar)
// ============================================
const syncDatabase = async (force = false) => {
    try {
        console.log('🔄 Sincronizando base de datos...');
        await database_1.default.authenticate();
        console.log('✅ Conexión a base de datos exitosa');
        // Configurar asociaciones antes de sincronizar
        (0, exports.setupAssociations)();
        // Sincronizar todos los modelos definidos
        await database_1.default.sync({ force, alter: !force });
        console.log(`✅ Base de datos sincronizada ${force ? '(recreada)' : '(actualizada)'}`);
    }
    catch (error) {
        console.error('❌ Error al sincronizar base de datos:', error);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
// Alias para que sea más semántico
exports.Post = GobModelPost_1.default;
exports.default = database_1.default;
//# sourceMappingURL=index.js.map
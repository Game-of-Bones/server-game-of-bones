"use strict";
/**
 * CONFIGURACIÓN DE TESTS
 *
 * Inicializa la base de datos de test y configura el entorno
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const dotenv_1 = require("dotenv");
const database_1 = __importDefault(require("../database/database"));
// ✅ Importar todos los modelos para configurar asociaciones
const User_1 = require("../models/User");
const Comment_1 = require("../models/Comment");
const GobModelPost_1 = __importDefault(require("../models/GobModelPost")); // Post/Fossil
const Like_1 = require("../models/Like");
// Cargar variables de entorno
(0, dotenv_1.config)();
// ✅ IMPORTANTE: Forzar NODE_ENV a test
process.env.NODE_ENV = 'test';
/**
 * Configurar asociaciones entre modelos
 * Esta función se ejecuta antes de los tests para establecer relaciones
 */
const setupAssociations = () => {
    console.log('🔗 Configurando asociaciones de modelos...');
    // ============================================
    // ASOCIACIONES: User <-> Fossil (Post)
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
    // ASOCIACIONES: User <-> Comment
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
    // ASOCIACIONES: Fossil (Post) <-> Comment
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
    // ASOCIACIONES: User <-> Like
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
    // ASOCIACIONES: Fossil (Post) <-> Like
    // ============================================
    GobModelPost_1.default.hasMany(Like_1.Like, {
        foreignKey: 'post_id',
        as: 'likes'
    });
    Like_1.Like.belongsTo(GobModelPost_1.default, {
        foreignKey: 'post_id',
        as: 'post'
    });
    console.log('✅ Asociaciones configuradas correctamente');
};
exports.setupAssociations = setupAssociations;
// Configurar asociaciones al inicio
(0, exports.setupAssociations)();
// ============================================
// HOOKS DE JEST
// ============================================
/**
 * Antes de TODOS los tests
 * Se ejecuta una sola vez al inicio
 */
beforeAll(async () => {
    try {
        console.log('\n🧪 ========================================');
        console.log('INICIANDO TESTS - SETUP');
        console.log('========================================\n');
        // Conectar a la base de datos de test
        await database_1.default.authenticate();
        console.log('✅ Conectado a la base de datos de test');
        console.log(`📊 Database: ${process.env.DB_TEST_NAME || 'game_of_bones_app_test'}`);
        // Sincronizar modelos (recrear tablas)
        await database_1.default.sync({ force: true });
        console.log('✅ Tablas creadas en la base de datos de test\n');
    }
    catch (error) {
        console.error('❌ Error en setup de tests:', error);
        throw error;
    }
});
/**
 * Después de TODOS los tests
 * Se ejecuta una sola vez al final
 */
afterAll(async () => {
    try {
        console.log('\n🧹 Limpiando y cerrando conexión...');
        // Cerrar conexión
        await database_1.default.close();
        console.log('✅ Conexión a la base de datos cerrada');
        console.log('\n========================================');
        console.log('TESTS FINALIZADOS');
        console.log('========================================\n');
    }
    catch (error) {
        console.error('❌ Error al cerrar conexión:', error);
    }
});
/**
 * Después de CADA test individual (opcional)
 * Útil para limpiar datos entre tests
 */
afterEach(async () => {
    // ⚠️ COMENTADO por defecto para que cada test tenga sus propios datos
    // Descomentar si quieres limpiar la BD después de cada test:
    /*
    try {
      // Limpiar todas las tablas (en orden inverso a las FK)
      await Like.destroy({ where: {}, force: true });
      await Comment.destroy({ where: {}, force: true });
      await Fossil.destroy({ where: {}, force: true });
      await User.destroy({ where: {}, force: true });
    } catch (error) {
      console.error('Error al limpiar datos entre tests:', error);
    }
    */
});
/**
 * Timeout global para operaciones de BD
 */
jest.setTimeout(10000); // 10 segundos
// ============================================
// OPCIONAL: Silenciar logs durante tests
// ============================================
// Descomentar para silenciar console.log durante tests:
/*
global.console = {
  ...console,
  log: jest.fn(),    // Silencia console.log
  debug: jest.fn(),  // Silencia console.debug
  info: jest.fn(),   // Silencia console.info
  warn: jest.fn(),   // Silencia console.warn
  // error se mantiene para ver errores reales
};
*/
//# sourceMappingURL=setup.js.map
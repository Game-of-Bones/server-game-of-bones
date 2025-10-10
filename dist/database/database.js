"use strict";
/**
 * CONFIGURACIÓN DE SEQUELIZE
 *
 * Configura la conexión a la base de datos MySQL
 * usando variables de entorno
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Detectar si estamos en modo test
const isTest = process.env.NODE_ENV === 'test';
// Configuración según el entorno
const config = {
    database: isTest
        ? (process.env.DB_TEST_NAME || 'game_of_bones_app_test')
        : (process.env.DB_NAME || 'game_of_bones_app'),
    username: isTest
        ? (process.env.DB_TEST_USER || process.env.DB_USER || 'root')
        : (process.env.DB_USER || 'root'),
    password: isTest
        ? (process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '')
        : (process.env.DB_PASSWORD || ''),
    host: isTest
        ? (process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost')
        : (process.env.DB_HOST || 'localhost'),
    port: isTest
        ? parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306')
        : parseInt(process.env.DB_PORT || '3306'),
};
const sequelize = new sequelize_1.Sequelize({
    database: config.database,
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    // Configuración de pool de conexiones
    pool: {
        max: isTest ? 5 : 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // Logging (desactiva en test y producción)
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // Timezone
    timezone: '+00:00',
    // Define opciones por defecto para todos los modelos
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Conexión exitosa a: ${config.database}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error de conexión:', error);
        return false;
    }
};
exports.testConnection = testConnection;
exports.default = sequelize;
//# sourceMappingURL=database.js.map
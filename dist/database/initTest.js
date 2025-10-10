"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
// Cargar variables de entorno
(0, dotenv_1.config)();
// Forzar NODE_ENV a test para este script
process.env.NODE_ENV = 'test';
const initTestDatabase = async () => {
    // Conexión root para crear/eliminar la base de datos
    const rootConnection = new sequelize_1.Sequelize({
        host: process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306'),
        username: process.env.DB_TEST_USER || process.env.DB_USER || 'root',
        password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '',
        dialect: 'mysql',
        logging: false,
    });
    try {
        console.log('🔧 Conectando al servidor MySQL...');
        await rootConnection.authenticate();
        console.log('✅ Conectado al servidor MySQL');
        // Obtener nombre de la BD de test
        const dbName = process.env.DB_TEST_NAME || 'game_of_bones_app_test';
        // Eliminar base de datos si existe
        console.log(`🗑️  Eliminando base de datos ${dbName} si existe...`);
        await rootConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        console.log('✅ Base de datos eliminada (si existía)');
        // Crear nueva base de datos
        console.log(`📦 Creando base de datos ${dbName}...`);
        await rootConnection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('✅ Base de datos de test creada exitosamente');
        // Cerrar conexión root
        await rootConnection.close();
        // ============================================
        // Conectar a la BD de test y crear tablas
        // ============================================
        console.log('\n📊 Sincronizando modelos...');
        // Importar sequelize configurado (ya detectará NODE_ENV=test)
        const sequelize = (await Promise.resolve().then(() => __importStar(require('./database')))).default;
        // Importar todos los modelos para registrarlos
        await Promise.resolve().then(() => __importStar(require('../models')));
        // Sincronizar modelos (crear tablas)
        await sequelize.sync({ force: true });
        console.log('✅ Tablas creadas exitosamente');
        // ============================================
        // Ejecutar seeders (opcional)
        // ============================================
        console.log('\n🌱 Ejecutando seeders...');
        try {
            const { default: runAllSeeders } = await Promise.resolve().then(() => __importStar(require('../server/script/runAllSeeders')));
            await runAllSeeders();
            console.log('✅ Seeders ejecutados correctamente');
        }
        catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                console.log('ℹ️  No se encontraron seeders (opcional)');
            }
            else {
                console.warn('⚠️  Error ejecutando seeders:', error.message);
            }
        }
        // Cerrar conexión
        await sequelize.close();
        console.log('✅ Conexión cerrada');
        console.log('\n🎉 Base de datos de test inicializada correctamente');
        console.log(`📍 Nombre de la base de datos: ${dbName}`);
        console.log('\n💡 Próximos pasos:');
        console.log('  1. npm run dev      - Levantar API en modo desarrollo');
        console.log('  2. Usar Postman     - Probar endpoints manualmente');
        console.log('  3. npm test         - Ejecutar tests automáticos\n');
    }
    catch (error) {
        console.error('❌ Error al inicializar la base de datos de test:', error);
        throw error;
    }
};
// Ejecutar si es llamado directamente
if (require.main === module) {
    initTestDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
exports.default = initTestDatabase;
//# sourceMappingURL=initTest.js.map
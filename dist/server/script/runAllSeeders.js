"use strict";
// src/server/script/runAllSeeders.ts
/**
 * EJECUTAR TODOS LOS SEEDERS
 * Script para poblar la base de datos con datos de prueba
 * Ejecutar: npm run seed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../../database/database"));
const models_1 = require("../../models");
const _01_users_1 = require("../../database/seeders/01-users");
dotenv_1.default.config();
const runAllSeeders = async () => {
    try {
        console.log('\n🌱 ========================================');
        console.log('🦴 GAME OF BONES - SEEDERS');
        console.log('========================================\n');
        // 1. Conectar a la base de datos
        console.log('🔌 Conectando a la base de datos...');
        await database_1.default.authenticate();
        console.log('✅ Conexión establecida\n');
        // 2. Configurar asociaciones
        console.log('🔗 Configurando relaciones entre modelos...');
        (0, models_1.setupAssociations)();
        console.log('✅ Relaciones configuradas\n');
        // 3. Sincronizar modelos (⚠️ alter: true para no perder datos)
        console.log('🔄 Sincronizando modelos con la base de datos...');
        await database_1.default.sync({ alter: true }); // Usar alter en lugar de force
        console.log('✅ Modelos sincronizados\n');
        // 4. Ejecutar seeders en orden
        console.log('📦 Ejecutando seeders...\n');
        // ORDEN IMPORTANTE:
        // 1. Users (no depende de nadie)
        await (0, _01_users_1.seedUsers)();
        console.log('');
        // 2. Fossils/Posts (depende de Users)
        // await seedFossils(); // Descomentar cuando tu compañera lo cree
        // console.log('');
        // 3. Comments (depende de Users y Posts)
        // await seedComments(); // Comentar hasta que Posts exista
        // console.log('');
        console.log('========================================');
        console.log('🎉 SEEDERS COMPLETADOS EXITOSAMENTE!');
        console.log('========================================\n');
        console.log('📝 Credenciales de prueba:');
        console.log('   👑 Admin: admin@gameofbones.com / admin123');
        console.log('   👤 User:  maria@example.com / password123\n');
        console.log('💡 Próximos pasos:');
        console.log('   1. npm run dev     - Iniciar servidor');
        console.log('   2. Usar Postman    - Probar endpoints');
        console.log('   3. npm test        - Ejecutar tests\n');
        // Cerrar conexión
        await database_1.default.close();
        process.exit(0);
    }
    catch (error) {
        console.error('\n❌ ========================================');
        console.error('ERROR AL EJECUTAR SEEDERS');
        console.error('========================================');
        console.error(error);
        console.error('========================================\n');
        await database_1.default.close();
        process.exit(1);
    }
};
// Ejecutar si es llamado directamente
if (require.main === module) {
    runAllSeeders();
}
exports.default = runAllSeeders;
//# sourceMappingURL=runAllSeeders.js.map
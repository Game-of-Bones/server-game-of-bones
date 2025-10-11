// src/scripts/init-test-db.ts
/**
 * SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS DE TEST
 * 
 * Este script:
 * 1. Elimina la BD de test si existe
 * 2. Crea la BD de test desde cero
 * 3. Sincroniza los modelos
 * 4. Ejecuta los seeders de test
 * 
 * Uso:
 *   npm run test:db
 */

import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

// Cargar variables de entorno
config();

// Forzar NODE_ENV a test
process.env.NODE_ENV = 'test';

const initTestDatabase = async () => {
  // Conexión root para crear/eliminar la BD
  const rootConnection = new Sequelize({
    host: process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306'),
    username: process.env.DB_TEST_USER || process.env.DB_USER || 'root',
    password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    logging: false,
  });

  try {
    console.log('\n🧪 ========================================');
    console.log('🧪 INICIALIZANDO BD DE TEST');
    console.log('🧪 ========================================\n');

    console.log('🔧 Conectando al servidor MySQL...');
    await rootConnection.authenticate();
    console.log('✅ Conectado al servidor MySQL');

    const dbName = process.env.DB_TEST_NAME || 'game_of_bones_app_test';

    // Eliminar BD si existe
    console.log(`\n🗑️  Eliminando BD ${dbName} si existe...`);
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    console.log('✅ BD eliminada (si existía)');

    // Crear BD
    console.log(`\n📦 Creando BD ${dbName}...`);
    await rootConnection.query(
      `CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log('✅ BD de test creada');

    await rootConnection.close();

    // ============================================
    // Conectar a la BD de test y crear tablas
    // ============================================
    console.log('\n📊 Sincronizando modelos...');

    const sequelize = (await import('../database/database')).default;

    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas');

    // ============================================
    // Ejecutar seeders
    // ============================================
    console.log('\n🌱 Ejecutando seeders de test...');
    try {
      // ✅ RUTA CORREGIDA: src/scripts/runAllSeeders.ts
      const { default: runAllSeeders } = await import('./runAllSeeders');
      await runAllSeeders();
      console.log('✅ Seeders ejecutados');
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log('ℹ️  No se encontraron seeders');
      } else {
        console.warn('⚠️  Error ejecutando seeders:', error.message);
      }
    }

    await sequelize.close();

    console.log('\n🎉 ========================================');
    console.log('🎉 BD DE TEST LISTA');
    console.log('🎉 ========================================');
    console.log(`📍 BD: ${dbName}`);
    console.log('\n💡 Próximos pasos:');
    console.log('  npm test         → Ejecutar tests');
    console.log('  npm run test:server → Levantar servidor con BD test\n');

  } catch (error) {
    console.error('❌ Error al inicializar la BD de test:', error);
    throw error;
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  initTestDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initTestDatabase;
/**
 * INIT TEST DATABASE
 *
 * Script para inicializar la base de datos de test desde cero
 * Uso: npm run init:test
 *
 * Este script:
 * 1. Elimina la BD de test si existe
 * 2. Crea una BD de test nueva
 * 3. Sincroniza todos los modelos (crea tablas)
 * 4. Ejecuta seeders de test (datos mínimos)
 */

import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import sequelize from './database';
import '../models';
import runTestSeeders from '../seeders/test/runTestSeeders';

config();
process.env.NODE_ENV = 'test';

const initTestDatabase = async (): Promise<void> => {
  const rootConnection = new Sequelize({
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

    const dbName = process.env.DB_TEST_NAME || 'game_of_bones_app_test';

    console.log(`🗑️  Eliminando BD ${dbName} si existe...`);
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);

    console.log(`📦 Creando BD ${dbName}...`);
    await rootConnection.query(
      `CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log('✅ Base de datos de test creada');

    await rootConnection.close();

    // ============================================
    // Sincronizar modelos
    // ============================================
    console.log('\n📊 Sincronizando modelos...');

    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas exitosamente');

    // ============================================
    // Ejecutar seeders de test
    // ============================================
    console.log('\n🌱 Ejecutando seeders de test...');
    try {
      await runTestSeeders();
      console.log('✅ Seeders de test ejecutados correctamente');
    } catch (error: any) {
      console.warn('⚠️  Error ejecutando seeders:', error.message);
    }

    await sequelize.close();

    console.log('\n🎉 Base de datos de test lista');
    console.log(`📍 BD: ${dbName}`);
    console.log('\n💡 Próximos pasos:');
    console.log('  npm test        - Ejecutar tests automáticos');
    console.log('  npm run dev     - Levantar servidor en desarrollo\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

if (require.main === module) {
  initTestDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initTestDatabase;

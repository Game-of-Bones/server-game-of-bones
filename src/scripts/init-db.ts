// src/scripts/init-db.ts
/**
 * SCRIPT DE INICIALIZACIÓN COMPLETA DE LA BASE DE DATOS
 *
 * Este script:
 * 1. Crea la base de datos si no existe
 * 2. Sincroniza los modelos (crea tablas)
 * 3. Ejecuta los seeders
 *
 * Uso: npm run db:init
 */

import 'reflect-metadata';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// ✅ CRÍTICO: Importar sequelize PRIMERO
import sequelize from '../database/database';

// ✅ IMPORTANTE: Importar TODOS los modelos para que se registren
import { User } from '../models/User';
import Fossil from '../models/GobModelPost';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';

// ✅ Luego importar los seeders
import { seedUsers } from '../database/seeders/01-users';
import { seedFossils } from '../database/seeders/02-fossils';
import { seedComments } from '../database/seeders/03-comments';

dotenv.config();

const initDatabase = async () => {
  const isTest = process.env.NODE_ENV === 'test';
  const dbName = isTest
    ? (process.env.DB_TEST_NAME || 'game_of_bones_app_test')
    : (process.env.DB_NAME || 'game_of_bones_app');

  console.log('\n🦴 ========================================');
  console.log('GAME OF BONES - INICIALIZACIÓN DE BD');
  console.log('========================================\n');
  console.log(`📊 Base de datos: ${dbName}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);

  try {
    // ============================================
    // PASO 1: CREAR BASE DE DATOS SI NO EXISTE
    // ============================================
    console.log('📦 Paso 1: Verificando/creando base de datos...');

    const rootConnection = new Sequelize({
      host: isTest
        ? (process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost')
        : (process.env.DB_HOST || 'localhost'),
      port: isTest
        ? parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306')
        : parseInt(process.env.DB_PORT || '3306'),
      username: isTest
        ? (process.env.DB_TEST_USER || process.env.DB_USER || 'root')
        : (process.env.DB_USER || 'root'),
      password: isTest
        ? (process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '')
        : (process.env.DB_PASSWORD || ''),
      dialect: 'mysql',
      logging: false
    });

    await rootConnection.authenticate();
    console.log('✅ Conectado al servidor MySQL\n');

    // Crear base de datos si no existe
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅ Base de datos '${dbName}' verificada/creada\n`);

    await rootConnection.close();

    // ============================================
    // PASO 2: CONECTAR Y SINCRONIZAR MODELOS
    // ============================================
    console.log('📦 Paso 2: Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    console.log('🔗 Paso 3: Modelos cargados automáticamente vía decoradores\n');

    console.log('🔄 Paso 4: Sincronizando modelos (creando tablas)...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tablas sincronizadas\n');

    // ============================================
    // PASO 3: EJECUTAR SEEDERS
    // ============================================
    console.log('🌱 Paso 5: Ejecutando seeders...\n');

    console.log('   📝 Seeder 1/3: Usuarios...');
    await seedUsers();

    console.log('   🦴 Seeder 2/3: Fósiles...');
    await seedFossils();

    console.log('   💬 Seeder 3/3: Comentarios...');
    await seedComments();

    console.log('\n========================================');
    console.log('🎉 INICIALIZACIÓN COMPLETADA');
    console.log('========================================\n');

    console.log('🔐 Credenciales de prueba:');
    console.log('   👑 Admin: admin@gameofbones.com / admin123');
    console.log('   👤 User:  maria@example.com / password123\n');

    console.log('📚 Datos creados:');
    const userCount = await sequelize.models.User.count();
    const fossilCount = await sequelize.models.Fossil.count();
    const commentCount = await sequelize.models.Comment.count();
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   🦴 Fósiles: ${fossilCount}`);
    console.log(`   💬 Comentarios: ${commentCount}\n`);

    console.log('💡 Próximos pasos:');
    console.log('   1. npm run dev        - Iniciar servidor');
    console.log('   2. npm test           - Ejecutar tests');
    console.log('   3. http://localhost:3000/health - Health check\n');

    await sequelize.close();
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ ========================================');
    console.error('ERROR EN INICIALIZACIÓN');
    console.error('========================================');
    console.error(error);
    console.error('========================================\n');

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Verifica las credenciales de MySQL en tu archivo .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Verifica que MySQL esté corriendo en tu sistema');
    }

    try {
      await sequelize.close();
    } catch (e) {
      // Ignorar error al cerrar
    }

    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  initDatabase();
}

export default initDatabase;

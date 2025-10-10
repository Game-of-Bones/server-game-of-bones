// src/scripts/init-db.ts
/**
 * SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
 * 
 * Este script:
 * 1. Conecta a la base de datos
 * 2. Sincroniza los modelos (crea/actualiza tablas)
 * 3. Ejecuta los seeders según el entorno
 * 
 * Uso:
 *   npm run db:init          # Desarrollo (no recrea tablas)
 *   npm run db:init:force    # Desarrollo (recrea tablas)
 */

import dotenv from 'dotenv';
dotenv.config();

import sequelize, { testConnection, syncDatabase } from '../database/database';
import { runAllSeeders } from '../script/runAllSeeders';

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

const initDatabase = async (): Promise<void> => {
  const isTest = process.env.NODE_ENV === 'test';
  const forceSync = process.argv.includes('--force') || isTest;

  try {
    console.log('\n🚀 ================================');
    console.log('🚀 INICIALIZANDO BASE DE DATOS');
    console.log('🚀 ================================\n');

    // 1. Test de conexión
    console.log('1️⃣  Verificando conexión...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }
    console.log('');

    // 2. Sincronizar modelos
    console.log('2️⃣  Sincronizando modelos...');
    await syncDatabase({ 
      force: forceSync,
      alter: !forceSync 
    });
    console.log('');

    // 3. Ejecutar seeders
    console.log('3️⃣  Ejecutando seeders...');
    await runAllSeeders();

    console.log('\n✅ ================================');
    console.log('✅ BASE DE DATOS INICIALIZADA');
    console.log('✅ ================================\n');

    // Mostrar estadísticas
    await showDatabaseStats();

  } catch (error) {
    console.error('\n❌ ================================');
    console.error('❌ ERROR EN INICIALIZACIÓN');
    console.error('❌ ================================\n');
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada\n');
    process.exit(0);
  }
};

// ============================================
// MOSTRAR ESTADÍSTICAS
// ============================================

const showDatabaseStats = async (): Promise<void> => {
  try {
    console.log('📊 ================================');
    console.log('📊 ESTADÍSTICAS DE LA BASE DE DATOS');
    console.log('📊 ================================\n');

    const [usersResult] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    const [fossilsResult] = await sequelize.query('SELECT COUNT(*) as count FROM fossils');
    const [commentsResult] = await sequelize.query('SELECT COUNT(*) as count FROM comments');
    const [likesResult] = await sequelize.query('SELECT COUNT(*) as count FROM likes');

    const users = (usersResult as any)[0].count;
    const fossils = (fossilsResult as any)[0].count;
    const comments = (commentsResult as any)[0].count;
    const likes = (likesResult as any)[0].count;

    console.log(`   👥 Usuarios:    ${users}`);
    console.log(`   🦴 Fósiles:     ${fossils}`);
    console.log(`   💬 Comentarios: ${comments}`);
    console.log(`   ❤️  Likes:       ${likes}`);
    console.log('');

  } catch (error) {
    console.log('ℹ️  No se pudieron obtener estadísticas');
  }
};

// ============================================
// EJECUTAR
// ============================================

initDatabase();
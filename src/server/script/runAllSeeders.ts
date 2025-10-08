/**
 * EJECUTAR TODOS LOS SEEDERS
 * 
 * Script para poblar la base de datos con datos de prueba
 */

import dotenv from 'dotenv';
import { syncDatabase } from '../../models';
// @ts-ignore - Seeders temporales hasta que se desarrollen
import { seedUsers } from './01-users';
// @ts-ignore - Seeders temporales hasta que se desarrollen
import { seedPosts } from './02-posts';
import seedComments from './03-comments';

dotenv.config();

const runAllSeeders = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seeders...\n');

    // Sincronizar base de datos (recrear tablas)
    await syncDatabase(true);
    console.log('');

    // Ejecutar seeders en orden
    // @ts-ignore
    if (typeof seedUsers === 'function') {
      await seedUsers();
    } else {
      console.log('⚠️  Seeder de usuarios no disponible aún');
    }

    // @ts-ignore
    if (typeof seedPosts === 'function') {
      await seedPosts();
    } else {
      console.log('⚠️  Seeder de posts no disponible aún');
    }

    await seedComments();

    console.log('\n✅ Todos los seeders ejecutados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando seeders:', error);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllSeeders();
}

export default runAllSeeders;
/**
 * EJECUTAR TODOS LOS SEEDERS
 *
 * Script para poblar la base de datos con datos de prueba
 */

import dotenv from 'dotenv';
import { syncDatabase } from '../models';
import { seedComments } from './03-comments';
import { seedPosts } from './02-posts';

dotenv.config();

const runAllSeeders = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seeders...\n');

    // Sincronizar base de datos (recrear tablas)
    await syncDatabase(true);
    console.log('');
// =====================================================
    // 2️⃣ Ejecutar seeders en orden lógico
    // =====================================================

    // await seedUsers();   // (Descomenta cuando el seeder de usuarios esté listo)
    await seedPosts();     // ✅ Seeder de posts (Fósiles)
    await seedComments();  // ✅ Seeder de comentarios (usa post_id)

    // ============================================
    // SEEDERS PENDIENTES (de otros compañeros)
    // ============================================

    /*
    // Descomentar cuando estén disponibles:

    // await seedUsers();   // Pendiente: User seeder
    // await seedLikes();   // Pendiente: Like seeder
    */

    console.log('\n✅ Todos los seeders ejecutados exitosamente');
    console.log('📊 Datos de prueba cargados en la base de datos\n');

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

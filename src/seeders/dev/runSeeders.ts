/**
 * EJECUTOR DE SEEDERS - DESARROLLO
 *
 * Propósito:
 * - Ejecutar todos los seeders de desarrollo en el orden correcto
 * - Sincronizar la base de datos antes de insertar datos
 * - Proveer feedback claro del progreso
 *
 * Orden de ejecución:
 * 1. Sincronizar BD (recrear tablas)
 * 2. Users (base para todo)
 * 3. Posts (requiere users)
 * 4. Comments (requiere users y posts)
 *
 * Uso:
 * - npm run seed:dev
 */

import dotenv from 'dotenv';
import { syncDatabase } from '../../models';
import { seedUsers } from './01-users';
import { seedPosts } from './02-posts';
import { seedComments } from './03-comments';

dotenv.config();

const runSeeders = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seeders de DESARROLLO...\n');

    // 1. Sincronizar base de datos (recrear tablas en desarrollo)
    console.log('🔄 Sincronizando base de datos...');
    await syncDatabase(true); // force: true en desarrollo
    console.log('✅ Base de datos sincronizada\n');

    // 2. Ejecutar seeders en orden lógico
    await seedUsers();
    console.log('');

    await seedPosts();
    console.log('');

    await seedComments();
    console.log('');

    // Resumen final
    console.log('🎉 Todos los seeders ejecutados exitosamente');
    console.log('📊 Base de datos de desarrollo lista para usar\n');
    console.log('💡 Próximos pasos:');
    console.log('   1. npm run dev      - Iniciar servidor');
    console.log('   2. Usar Postman     - Probar endpoints');
    console.log('   3. Credenciales:');
    console.log('      Admin: admin@gameofbones.com / Admin123!');
    console.log('      User:  paleo1@gameofbones.com / User123!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando seeders:', error);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  runSeeders();
}

export default runSeeders;

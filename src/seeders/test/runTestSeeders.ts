/**
 * EJECUTOR DE SEEDERS - TEST
 * 
 * Propósito:
 * - Ejecutar seeders de test en el orden correcto
 * - Datos mínimos para tests rápidos
 * - NO sincroniza BD (lo hace setup.ts)
 * 
 * Orden de ejecución:
 * 1. Users (2 usuarios)
 * 2. Posts (3 posts)
 * 3. Comments (2 comentarios)
 * 
 * Uso:
 * - Se llama desde tests/setup.ts automáticamente
 * - npm run seed:test (manual)
 */

import { seedTestUsers } from './users.seed';
import { seedTestPosts } from './posts.seed';
import { seedTestComments } from './comments.seed';

const runTestSeeders = async (): Promise<void> => {
  try {
    console.log('��� Running test seeders...\n');

    // Ejecutar seeders en orden
    await seedTestUsers();
    await seedTestPosts();
    await seedTestComments();

    console.log('\n✅ Test seeders completed\n');

  } catch (error) {
    console.error('\n❌ Error running test seeders:', error);
    throw error;
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTestSeeders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runTestSeeders;

// src/server/seeders/index.ts
/**
 * RUNNER PRINCIPAL DE SEEDERS
 * Ejecuta los seeders según el entorno
 */

import sequelize from '../database/database';

// Importar seeders de desarrollo
import { seedUsers as seedUsersDev } from '../database/seeders/development/01-users';
import { seedPosts as seedFossilsDev } from '../database/seeders/development/02-posts';
import { seedComments as seedCommentsDev } from '../database/seeders/development/03-comments';
import { seedLikes as seedLikesDev } from '../database/seeders/development/04-likes';

// Importar seeders de test
import { seedUsers as seedUsersTest } from '../database/seeders/test/01-users';
import { seedPosts as seedFossilsTest } from '../database/seeders/test/02-posts';
import { seedComments as seedCommentsTest } from '../database/seeders/test/03-comments';
import { seedLikes as seedLikesTest } from '../database/seeders/test/04-likes';

const isTest = process.env.NODE_ENV === 'test';

export const runAllSeeders = async (): Promise<void> => {
  try {
    console.log('\n🌱 ================================');
    console.log(`🌱 EJECUTANDO SEEDERS (${isTest ? 'TEST' : 'DEVELOPMENT'})`);
    console.log('🌱 ================================\n');

    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida\n');

    if (isTest) {
      // ============================================
      // SEEDERS DE TEST
      // ============================================
      console.log('📊 Modo: TEST - Datos predecibles\n');
      
      await seedUsersTest();
      console.log('');
      
      await seedFossilsTest();
      console.log('');
      
      await seedCommentsTest();
      console.log('');
      
      await seedLikesTest();
      console.log('');
      
    } else {
      // ============================================
      // SEEDERS DE DESARROLLO
      // ============================================
      console.log('📊 Modo: DEVELOPMENT - Datos realistas\n');
      
      await seedUsersDev();
      console.log('');
      
      await seedFossilsDev();
      console.log('');
      
      await seedCommentsDev();
      console.log('');
      
      await seedLikesDev();
      console.log('');
    }

    console.log('🎉 ================================');
    console.log('🎉 SEEDERS COMPLETADOS');
    console.log('🎉 ================================\n');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO SEEDERS\n', error);
    throw error;
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      console.log('✅ Seeders ejecutados exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export default runAllSeeders;
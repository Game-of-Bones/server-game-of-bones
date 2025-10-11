// src/scripts/runAllSeeders.ts
/**
 * EJECUTOR DE SEEDERS
 * Detecta automáticamente el entorno y ejecuta los seeders correspondientes
 */

const isTest = process.env.NODE_ENV === 'test';

/**
 * Ejecutar todos los seeders según el entorno
 */
export const runAllSeeders = async (): Promise<void> => {
  try {
    const env = isTest ? 'test' : 'development';
    console.log(`\n🌱 Ejecutando seeders (${env})...\n`);

    if (isTest) {
      // ============================================
      // SEEDERS DE TEST
      // ============================================
      const { seedUsers } = await import('../../database/seeders/test/01-users');
      const { seedPosts } = await import('../../database/seeders/test/02-posts');
      const { seedComments } = await import('../../database/seeders/test/03-comments');
      const { seedLikes } = await import('../../database/seeders/test/04-likes');

      await seedUsers();
      await seedPosts();
      await seedComments();
      await seedLikes();

    } else {
      // ============================================
      // SEEDERS DE DEVELOPMENT
      // ============================================
      const { seedUsers } = await import('../../database/seeders/development/01-users');
      const { seedPosts } = await import('../../database/seeders/development/02-posts');
      const { seedComments } = await import('../../database/seeders/development/03-comments');
      const { seedLikes } = await import('../../database/seeders/development/04-likes');

      await seedUsers();
      await seedPosts();
      await seedComments();
      await seedLikes();
    }

    console.log('\n✅ Todos los seeders ejecutados correctamente\n');

  } catch (error: any) {
    console.error('\n❌ Error ejecutando seeders:', error.message);
    throw error;
  }
};

export default runAllSeeders;
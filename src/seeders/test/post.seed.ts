/**
 * SEEDER DE POSTS - TEST
 *
 * Propósito:
 * - Crear posts mínimos para tests automatizados
 * - Datos predecibles y consistentes
 * - Solo 3 posts con diferentes estados
 *
 * Requisitos previos:
 * - Usuarios de test deben existir
 *
 * Uso:
 * - Se ejecuta automáticamente en tests (setup.ts)
 * - npm run seed:test (manual)
 */

import { Post } from '../../models/Post';
import { User } from '../../models/User';

export const seedTestPosts = async (): Promise<void> => {
  try {
    console.log('🦴 Seeding test posts...');

    const users = await User.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No test users found. Run user seeder first.');
      return;
    }

    // Solo 3 posts para tests (mínimo necesario)
    const postsData = [
      // Post 1: Publicado por admin
      {
        title: 'Test Post 1 - Published',
        summary: 'This is a published test post for automated testing.',
        fossil_type: 'bones_teeth' as const,
        location: 'Test Location',
        user_id: users[0].id, // Admin
        status: 'published' as const,
      },

      // Post 2: Borrador por admin
      {
        title: 'Test Post 2 - Draft',
        summary: 'This is a draft test post for automated testing.',
        fossil_type: 'plant_impressions' as const,
        location: 'Test Location 2',
        user_id: users[0].id, // Admin
        status: 'draft' as const,
      },

      // Post 3: Publicado por user normal
      {
        title: 'Test Post 3 - User Post',
        summary: 'This is a test post created by a regular user.',
        fossil_type: 'amber_insects' as const,
        location: 'Test Location 3',
        user_id: users[1].id, // User normal
        status: 'published' as const,
      },
    ];

    const createdPosts = await Post.bulkCreate(postsData);
    console.log(`✅ ${createdPosts.length} test posts created`);

  } catch (error: any) {
    console.error('❌ Error seeding test posts:', error.message);
    throw error;
  }
};

export default seedTestPosts;

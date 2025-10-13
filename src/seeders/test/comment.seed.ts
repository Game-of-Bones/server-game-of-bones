/**
 * SEEDER DE COMENTARIOS - TEST
 *
 * Propósito:
 * - Crear comentarios mínimos para tests automatizados
 * - Datos predecibles y consistentes
 * - Solo 2 comentarios básicos
 *
 * Requisitos previos:
 * - Usuarios de test deben existir
 * - Posts de test deben existir
 *
 * Uso:
 * - Se ejecuta automáticamente en tests (setup.ts)
 * - npm run seed:test (manual)
 */

import { Comment } from '../../models/Comment';
import { User } from '../../models/User';
import { Post } from '../../models/Post';

export const seedTestComments = async (): Promise<void> => {
  try {
    console.log('💬 Seeding test comments...');

    const users = await User.findAll();
    const posts = await Post.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No test users found. Run user seeder first.');
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No test posts found. Run posts seeder first.');
      return;
    }

    // Solo 2 comentarios para tests (mínimo necesario)
    const commentsData = [
      // Comentario 1: User normal en post del admin
      {
        content: 'This is a test comment from a user.',
        user_id: users[1].id, // User normal
        post_id: posts[0].id, // Primer post
      },

      // Comentario 2: Admin respondiendo
      {
        content: 'This is a test comment from admin.',
        user_id: users[0].id, // Admin
        post_id: posts[0].id, // Mismo post
      },
    ];

    const createdComments = await Comment.bulkCreate(commentsData);
    console.log(`✅ ${createdComments.length} test comments created`);

  } catch (error: any) {
    console.error('❌ Error seeding test comments:', error.message);
    throw error;
  }
};

export default seedTestComments;

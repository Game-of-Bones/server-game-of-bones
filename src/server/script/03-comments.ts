/**
 * SEEDER DE COMENTARIOS
 */

import Comment from '../../models/Comment';
// @ts-ignore - Modelos temporales hasta que se desarrollen
import User from '../../models/User';
// @ts-ignore - Modelos temporales hasta que se desarrollen
import Post from '../../models/Post';

const seedComments = async (): Promise<void> => {
  try {
    console.log('📝 Seeding comments...');

    // NOTA: Este seeder solo funcionará cuando User y Post existan
    // Por ahora lo dejamos preparado
    
    // Verificar que existen usuarios y posts
    // @ts-ignore
    const users = await User?.findAll();
    // @ts-ignore
    const posts = await Post?.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios. Ejecuta primero el seeder de usuarios.');
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No hay posts. Ejecuta primero el seeder de posts.');
      return;
    }

    const commentsData = [
      {
        content: '¡Increíble descubrimiento! Me encanta la paleontología.',
        user_id: users[0].id,
        post_id: posts[0].id,
      },
      {
        content: 'Muy interesante, gracias por compartir.',
        user_id: users[1]?.id || users[0].id,
        post_id: posts[0].id,
      },
      {
        content: 'Wow, no sabía esto sobre los dinosaurios.',
        user_id: users[0].id,
        post_id: posts[1]?.id || posts[0].id,
      },
    ];

    await Comment.bulkCreate(commentsData);
    console.log('✅ Comments seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding comments:', error);
    throw error;
  }
};

// Exportación por defecto Y nombrada
export default seedComments;
export { seedComments };
/**
 * SEEDER DE COMENTARIOS - DESARROLLO
 *
 * Propósito:
 * - Crear comentarios de prueba en posts existentes
 * - Simular interacción de usuarios en el blog
 * - Datos variados para probar la funcionalidad de comentarios
 *
 * Requisitos previos:
 * - Usuarios deben existir (ejecutar 01-users primero)
 * - Posts deben existir (ejecutar 02-posts primero)
 *
 * Uso:
 * - npm run seed:dev
 */

import { Comment } from '../../models/Comment';
import { User } from '../../models/User';
import { Post } from '../../models/Post';

export const seedComments = async (): Promise<void> => {
  try {
    console.log('💬 Seeding comments (desarrollo)...');

    // Verificar que existen usuarios
    const users = await User.findAll();
    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios. Ejecuta el seeder de usuarios primero.');
      console.log('💡 Comando: npm run seed:dev');
      return;
    }

    // Verificar que existen posts
    const posts = await Post.findAll();
    if (!posts || posts.length === 0) {
      console.log('⚠️  No hay posts. Ejecuta el seeder de posts primero.');
      console.log('💡 Comando: npm run seed:dev');
      return;
    }

    // Datos de comentarios variados para desarrollo
    const commentsData = [
      // Comentarios en el primer post (T-Rex)
      {
        content: '¡Increíble descubrimiento! Me encanta la paleontología. ¿Hay más información sobre el estado de conservación del cráneo?',
        user_id: users[1]?.id || users[0].id,
        post_id: posts[0].id,
      },
      {
        content: 'Fascinante. ¿Cuándo estará disponible para visitar en el museo? Me gustaría verlo en persona.',
        user_id: users[2]?.id || users[0].id,
        post_id: posts[0].id,
      },
      {
        content: 'Excelente trabajo del equipo de excavación. La Patagonia siempre nos sorprende con estos hallazgos.',
        user_id: users[3]?.id || users[0].id,
        post_id: posts[0].id,
      },

      // Comentarios en el segundo post (Plantas del Sahara)
      {
        content: 'Muy interesante, gracias por compartir. ¿Qué especies de plantas se identificaron?',
        user_id: users[0].id,
        post_id: posts[1].id,
      },
      {
        content: 'Wow, no sabía que el Sahara fue un ecosistema húmedo. La geología es fascinante.',
        user_id: users[4]?.id || users[0].id,
        post_id: posts[1].id,
      },

      // Comentarios en el tercer post (Insectos en ámbar)
      {
        content: 'El ámbar báltico es increíble para preservar detalles. ¿Hay fotos de mayor resolución disponibles?',
        user_id: users[1]?.id || users[0].id,
        post_id: posts[2].id,
      },
      {
        content: '¿Estos insectos tienen alguna relación con especies actuales? Me gustaría saber más sobre la evolución.',
        user_id: users[2]?.id || users[0].id,
        post_id: posts[2].id,
      },

      // Comentarios en el cuarto post (Huellas Utah)
      {
        content: 'Las huellas nos cuentan tanto sobre el comportamiento. ¿Se encontraron huellas de crías también?',
        user_id: users[3]?.id || users[0].id,
        post_id: posts[3].id,
      },

      // Comentarios en el quinto post (Trilobite)
      {
        content: 'Marruecos es un tesoro para la paleontología. Hermoso ejemplar.',
        user_id: users[0].id,
        post_id: posts[4].id,
      },
      {
        content: '¿Cuál es el tamaño aproximado de este trilobite? Se ve espectacular en la foto.',
        user_id: users[4]?.id || users[0].id,
        post_id: posts[4].id,
      },
    ];

    // Insertar comentarios en la base de datos
    const createdComments = await Comment.bulkCreate(commentsData);

    console.log(`✅ ${createdComments.length} comentarios creados exitosamente`);
    console.log(`   📊 Distribución por post:`);

    // Mostrar cuántos comentarios tiene cada post
    const commentsByPost = createdComments.reduce((acc: any, comment) => {
      acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
      return acc;
    }, {});

    Object.entries(commentsByPost).forEach(([postId, count]) => {
      console.log(`      Post #${postId}: ${count} comentarios`);
    });

  } catch (error: any) {
    console.error('❌ Error seeding comments:', error.message);

    // Ayuda específica si hay error de FK
    if (error.message.includes('foreign key constraint')) {
      console.log('\n⚠️  ERROR: Los posts o usuarios referenciados no existen.');
      console.log('💡 Solución: Ejecuta los seeders en orden:');
      console.log('   1. npm run seed:dev  (ejecuta todos en orden)');
    }

    throw error;
  }
};

export default seedComments;

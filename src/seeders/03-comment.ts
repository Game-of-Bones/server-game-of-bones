/**
 * SEEDER DE COMENTARIOS
 */

import { Comment } from '../../models/Comment';
import { User } from '../../models/User';
// TODO: Descomentar cuando Post esté disponible
// import { Post } from '../../models/Post';

export const seedComments = async (): Promise<void> => {
  try {
    console.log('📝 Seeding comments...');

    // Verificar que existen usuarios
    const users = await User.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos.');
      console.log('💡 Crea algunos usuarios manualmente o espera el seeder de usuarios.');
      console.log('ℹ️  Saltando seeder de comentarios...');
      return;
    }

    // TODO: Cuando Post esté disponible, descomentar esta verificación
    /*
    const posts = await Post.findAll();
    if (!posts || posts.length === 0) {
      console.log('⚠️  No hay posts en la base de datos.');
      console.log('💡 Crea algunos posts manualmente o espera el seeder de posts.');
      console.log('ℹ️  Saltando seeder de comentarios...');
      return;
    }
    */

    // Datos de ejemplo de comentarios
    // NOTA: Usar post_id = 1 asumiendo que existe (cambiar según tu BD)
    const commentsData = [
      {
        content: '¡Increíble descubrimiento! Me encanta la paleontología. Siempre he sido un apasionado de los dinosaurios.',
        user_id: users[0].id,
        post_id: 1, // TODO: Cambiar por posts[0].id cuando Post esté disponible
      },
      {
        content: 'Muy interesante, gracias por compartir esta información tan detallada.',
        user_id: users[1]?.id || users[0].id,
        post_id: 1,
      },
      {
        content: 'Wow, no sabía esto sobre los dinosaurios del Cretácico. Fascinante.',
        user_id: users[0].id,
        post_id: 2, // TODO: Cambiar por posts[1].id cuando Post esté disponible
      },
      {
        content: 'Excelente artículo. ¿Tienes más información sobre este tema?',
        user_id: users[1]?.id || users[0].id,
        post_id: 2,
      },
      {
        content: '¿En qué museo se exhibe este fósil? Me gustaría verlo en persona.',
        user_id: users[0].id,
        post_id: 1,
      },
    ];

    // Crear comentarios
    const createdComments = await Comment.bulkCreate(commentsData);
    
    console.log(`✅ ${createdComments.length} comentarios creados exitosamente`);
    console.log('ℹ️  Nota: Los post_id son ficticios hasta que el modelo Post esté disponible');

  } catch (error: any) {
    console.error('❌ Error seeding comments:', error.message);
    
    // Si el error es por FK de post_id, informar claramente
    if (error.message.includes('foreign key constraint')) {
      console.log('\n⚠️  ERROR: Los posts referenciados no existen en la base de datos.');
      console.log('💡 Solución: Crea posts manualmente o espera el seeder de posts.');
      console.log('💡 Alternativa: Comenta temporalmente las FK en el modelo Comment.');
    }
    
    throw error;
  }
};

// Exportar también como default para compatibilidad
export default seedComments;
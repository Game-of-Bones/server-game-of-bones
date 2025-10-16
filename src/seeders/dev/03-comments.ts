/**
 * COMMENTS SEEDER - DEVELOPMENT
 *
 * Crea comentarios de prueba
 */

import { Comment } from '../../models/Comment';

export const seedComments = async (): Promise<void> => {
  console.log('🌱 Seeding comments...');

  const comments = [
    {
      content: '¡Fascinante descubrimiento! El Joaquinraptor abre nuevas líneas de investigación sobre los terópodos sudamericanos.',
      post_id: 1,
      user_id: 3,
    },
    {
      content: 'Me encantaría saber más sobre el contexto geológico del hallazgo. ¿Hay más información disponible?',
      post_id: 1,
      user_id: 4,
    },
    {
      content: 'Excelente trabajo de campo. La preservación de los restos es impresionante.',
      post_id: 2,
      user_id: 2,
    },
    {
      content: 'Este hallazgo confirma la diversidad de fauna en la Patagonia durante el Cretácico.',
      post_id: 2,
      user_id: 5,
    },
    {
      content: 'El tamaño de este carnívoro es realmente impresionante. ¿Cuántos especímenes se han encontrado?',
      post_id: 3,
      user_id: 2,
    },
    {
      content: 'Los ammonites siempre me han parecido fascinantes. Gracias por compartir este descubrimiento.',
      post_id: 4,
      user_id: 3,
    },
    {
      content: 'Las impresiones de plantas están increíblemente detalladas. Un testimonio excepcional del pasado.',
      post_id: 5,
      user_id: 4,
    },
    {
      content: '¿Es posible visitar el sitio del hallazgo? Me gustaría conocer más sobre este yacimiento.',
      post_id: 6,
      user_id: 5,
    },
    {
      content: 'Los insectos en ámbar son como cápsulas del tiempo. Absolutamente extraordinario.',
      post_id: 7,
      user_id: 2,
    },
  ];

  for (const commentData of comments) {
    await Comment.create(commentData);
  }

  console.log('✅ Comments seeded successfully');
};

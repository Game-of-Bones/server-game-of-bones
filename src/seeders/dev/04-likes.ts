-/**
 * LIKES SEEDER - DEVELOPMENT
 *
 * Crea likes de prueba
 */

import { Like } from '../../models/Like';

export const seedLikes = async (): Promise<void> => {
  console.log('🌱 Seeding likes...');

  const likes = [
    { post_id: 1, user_id: 2 },
    { post_id: 1, user_id: 3 },
    { post_id: 1, user_id: 4 },
    { post_id: 2, user_id: 2 },
    { post_id: 2, user_id: 5 },
    { post_id: 3, user_id: 3 },
    { post_id: 3, user_id: 4 },
    { post_id: 3, user_id: 5 },
    { post_id: 4, user_id: 2 },
    { post_id: 4, user_id: 3 },
    { post_id: 5, user_id: 4 },
    { post_id: 6, user_id: 2 },
    { post_id: 7, user_id: 3 },
    { post_id: 7, user_id: 5 },
  ];

  for (const likeData of likes) {
    await Like.create(likeData);
  }

  console.log('✅ Likes seeded successfully');
};

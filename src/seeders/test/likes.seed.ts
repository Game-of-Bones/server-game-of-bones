/**
 * LIKES SEEDER - TEST
 */

import { Like } from '../../models/Like';

export const seedTestLikes = async (): Promise<void> => {
  console.log('🌱 Seeding test likes...');

  const likes = [
    { post_id: 1, user_id: 1 },
    { post_id: 1, user_id: 3 },
    { post_id: 2, user_id: 2 },
  ];

  for (const likeData of likes) {
    await Like.create(likeData);
  }

  console.log('✅ Test likes seeded');
};

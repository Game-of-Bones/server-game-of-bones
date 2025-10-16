/**
 * COMMENTS SEEDER - TEST
 */

import { Comment } from '../../models/Comment';

export const seedTestComments = async (): Promise<void> => {
  console.log('🌱 Seeding test comments...');

  const comments = [
    {
      content: 'This is a test comment on the first post for testing purposes.',
      post_id: 1,
      user_id: 2,
    },
    {
      content: 'Another test comment for automated testing of the comment system.',
      post_id: 1,
      user_id: 3,
    },
    {
      content: 'Test comment on second post to verify comment functionality works.',
      post_id: 2,
      user_id: 1,
    },
  ];

  for (const commentData of comments) {
    await Comment.create(commentData);
  }

  console.log('✅ Test comments seeded');
};

/**
 * USERS SEEDER - TEST
 */

import { User } from '../../models/User';

export const seedTestUsers = async (): Promise<void> => {
  console.log('🌱 Seeding test users...');

  const users = [
    {
      username: 'testadmin',
      email: 'admin@test.com',
      password_hash: 'Test123!',
      role: 'admin' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=1',
    },
    {
      username: 'testuser',
      email: 'user@test.com',
      password_hash: 'Test123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=2',
    },
    {
      username: 'testuser2',
      email: 'user2@test.com',
      password_hash: 'Test123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=3',
    },
  ];

  for (const userData of users) {
    await User.create(userData);
  }

  console.log('✅ Test users seeded');
};

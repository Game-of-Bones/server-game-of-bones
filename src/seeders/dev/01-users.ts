/**
 * USERS SEEDER - DEVELOPMENT
 *
 * Crea usuarios de prueba con avatares
 */

import { User } from '../../models/User';

export const seedUsers = async (): Promise<void> => {
  console.log('🌱 Seeding users...');

  const users = [
    {
      username: 'admin',
      email: 'admin@gameofbones.com',
      password_hash: 'Admin123!',
      role: 'admin' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=33',
    },
    {
      username: 'paleontologist_maria',
      email: 'maria@gameofbones.com',
      password_hash: 'Maria123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=47',
    },
    {
      username: 'fossil_hunter_carlos',
      email: 'carlos@gameofbones.com',
      password_hash: 'Carlos123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=12',
    },
    {
      username: 'dr_rodriguez',
      email: 'rodriguez@gameofbones.com',
      password_hash: 'Rodriguez123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=68',
    },
    {
      username: 'explorer_ana',
      email: 'ana@gameofbones.com',
      password_hash: 'Ana123!',
      role: 'user' as const,
      avatar_url: 'https://i.pravatar.cc/400?img=5',
    },
  ];

  for (const userData of users) {
    await User.create(userData);
  }

  console.log('✅ Users seeded successfully');
};

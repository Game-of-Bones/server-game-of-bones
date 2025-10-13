/**
 * SEEDER DE USUARIOS - TEST
 *
 * Propósito:
 * - Crear usuarios mínimos para tests automatizados
 * - Datos predecibles y consistentes
 * - Solo 2 usuarios: 1 admin, 1 user normal
 *
 * Uso:
 * - Se ejecuta automáticamente en tests (setup.ts)
 * - npm run seed:test (manual)
 */

import { User } from '../../models/User';
import bcrypt from 'bcrypt';

export const seedTestUsers = async (): Promise<void> => {
  try {
    console.log('👥 Seeding test users...');

    // Hash de contraseñas (menos rounds para velocidad en tests)
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    // Solo 2 usuarios para tests
    const usersData = [
      // Admin
      {
        username: 'testadmin',
        email: 'admin@test.com',
        password_hash: adminPassword,
        role: 'admin' as const,
      },
      // User normal
      {
        username: 'testuser',
        email: 'user@test.com',
        password_hash: userPassword,
        role: 'user' as const,
      },
    ];

    const createdUsers = await User.bulkCreate(usersData);
    console.log(`✅ ${createdUsers.length} test users created`);

  } catch (error: any) {
    console.error('❌ Error seeding test users:', error.message);
    throw error;
  }
};

export default seedTestUsers;

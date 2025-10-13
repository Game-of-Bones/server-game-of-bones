/**
 * SEEDER DE USUARIOS - DESARROLLO
 *
 * Propósito:
 * - Crear usuarios de prueba para desarrollo
 * - Incluye varios roles (admin, user)
 * - Datos variados para probar la app manualmente
 *
 * Uso:
 * - npm run seed:dev
 */

import { User } from '../../models/User';
import bcrypt from 'bcrypt';

export const seedUsers = async (): Promise<void> => {
  try {
    console.log('👥 Seeding users (desarrollo)...');

    // Hash de contraseñas (12 rounds por seguridad)
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('User123!', 12);

    // Datos de usuarios de desarrollo
    const usersData = [
      // Usuario admin
      {
        username: 'admin',
        email: 'admin@gameofbones.com',
        password_hash: adminPassword,
        role: 'admin' as const,
      },
      // Usuarios normales variados
      {
        username: 'paleontologist1',
        email: 'paleo1@gameofbones.com',
        password_hash: userPassword,
        role: 'user' as const,
      },
      {
        username: 'paleontologist2',
        email: 'paleo2@gameofbones.com',
        password_hash: userPassword,
        role: 'user' as const,
      },
      {
        username: 'researcher',
        email: 'researcher@gameofbones.com',
        password_hash: userPassword,
        role: 'user' as const,
      },
      {
        username: 'scientist',
        email: 'scientist@gameofbones.com',
        password_hash: userPassword,
        role: 'user' as const,
      },
    ];

    // Insertar usuarios en BD
    const createdUsers = await User.bulkCreate(usersData);

    console.log(`✅ ${createdUsers.length} usuarios creados`);
    console.log('💡 Credenciales de prueba:');
    console.log('   Admin: admin@gameofbones.com / Admin123!');
    console.log('   User:  paleo1@gameofbones.com / User123!');

  } catch (error: any) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

export default seedUsers;

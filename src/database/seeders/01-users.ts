// src/database/seeders/01-users.ts
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

/**
 * Seeder para crear usuarios de prueba
 */
export const seedUsers = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seed de usuarios...');

    // Verificar si ya existen usuarios
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('ℹ️  Ya existen usuarios en la base de datos. Saltando seed...');
      return;
    }

    // Crear usuarios de prueba
    const users = [
      {
        username: 'admin',
        email: 'admin@gameofbones.com',
        password_hash: await bcrypt.hash('admin123', 12),
        role: 'admin' as const
      },
      {
        username: 'maria_fossil',
        email: 'maria@example.com',
        password_hash: await bcrypt.hash('password123', 12),
        role: 'user' as const
      },
      {
        username: 'carlos_dino',
        email: 'carlos@example.com',
        password_hash: await bcrypt.hash('password123', 12),
        role: 'user' as const
      },
      {
        username: 'pepita_paleo',
        email: 'pepita@example.com',
        password_hash: await bcrypt.hash('password123', 12),
        role: 'user' as const
      },
      {
        username: 'luis_rex',
        email: 'luis@example.com',
        password_hash: await bcrypt.hash('password123', 12),
        role: 'user' as const
      }
    ];

    await User.bulkCreate(users);

    console.log('✅ Usuarios creados exitosamente:');
    console.log('   - admin@gameofbones.com (admin) - password: admin123');
    console.log('   - maria@example.com (user) - password: password123');
    console.log('   - carlos@example.com (user) - password: password123');
    console.log('   - pepita@example.com (user) - password: password123');
    console.log('   - luis@example.com (user) - password: password123');

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
    throw error;
  }
};

/**
 * Eliminar todos los usuarios (para testing)
 */
export const clearUsers = async (): Promise<void> => {
  try {
    await User.destroy({ where: {}, force: true });
    console.log('🗑️  Usuarios eliminados');
  } catch (error) {
    console.error('❌ Error al eliminar usuarios:', error);
    throw error;
  }
};

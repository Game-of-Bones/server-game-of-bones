/**
 * MODELS INDEX
 *
 * Punto de entrada central para todos los modelos
 * Las relaciones se configuran automáticamente con decoradores
 */

import sequelize from '../database/database';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// SINCRONIZAR BASE DE DATOS
// ============================================

/**
 * Sincroniza todos los modelos con la base de datos
 * @param force - Si es true, elimina y recrea las tablas (CUIDADO: borra datos)
 */
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    console.log('🔄 Sincronizando base de datos...');

    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa');

    // Sincronizar todos los modelos
    // force: true -> DROP + CREATE (destructivo)
    // alter: true -> ALTER TABLE (añade columnas, no destructivo)
    await sequelize.sync({ force, alter: !force });

    console.log(`✅ Base de datos sincronizada ${force ? '(recreada)' : '(actualizada)'}`);

  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    throw error;
  }
};

// ============================================
// EXPORTACIONES
// ============================================

export {
  sequelize,
  User,
  Post,
  Comment,
  Like,
};

export default sequelize;

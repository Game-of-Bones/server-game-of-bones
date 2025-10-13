// src/scripts/clean-db.ts
/**
 * SCRIPT PARA LIMPIAR LA BASE DE DATOS
 * Útil para resetear datos durante desarrollo
 * 
 * Uso:
 *   npm run clean-db
 */

import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../database/database';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import Fossil from '../models/Posts';
import { User } from '../models/User';

const cleanDatabase = async (): Promise<void> => {
  try {
    console.log('\n🧹 ================================');
    console.log('🧹 LIMPIANDO BASE DE DATOS');
    console.log('🧹 ================================\n');

    // Eliminar en orden inverso de dependencias
    console.log('1️⃣  Eliminando likes...');
    await Like.destroy({ where: {}, force: true });
    console.log('✅ Likes eliminados\n');

    console.log('2️⃣  Eliminando comentarios...');
    await Comment.destroy({ where: {}, force: true });
    console.log('✅ Comentarios eliminados\n');

    console.log('3️⃣  Eliminando posts...');
    await Fossil.destroy({ where: {}, force: true });
    console.log('✅ Posts eliminados\n');

    console.log('4️⃣  Eliminando usuarios...');
    await User.destroy({ where: {}, force: true });
    console.log('✅ Usuarios eliminados\n');

    console.log('✅ ================================');
    console.log('✅ BASE DE DATOS LIMPIA');
    console.log('✅ ================================\n');

  } catch (error) {
    console.error('\n❌ Error al limpiar la base de datos:', error);
    throw error;
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Ejecutar
cleanDatabase();
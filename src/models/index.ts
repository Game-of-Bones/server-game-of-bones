/**
 * MODELS INDEX - Configuración y relaciones
 */

import sequelize from '../config/database';
import Comment from './Comment';

// NOTA: Estas importaciones darán error temporal hasta que tus compis
// desarrollen sus modelos. Es NORMAL y esperado.
// @ts-ignore - Importación temporal hasta que se desarrollen los modelos
import User from './User';
// @ts-ignore - Importación temporal hasta que se desarrollen los modelos
import Post from './Post';

// ============================================
// DEFINIR RELACIONES (cuando los modelos existan)
// ============================================

// Estas relaciones se activarán cuando User y Post estén disponibles
// Por ahora las dejamos comentadas para evitar errores de runtime

/*
// User - Post (1:N)
User.hasMany(Post, {
  foreignKey: 'user_id',
  as: 'posts'
});
Post.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
});

// Post - Comment (1:N)
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  as: 'comments'
});
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

// User - Comment (1:N)
User.hasMany(Comment, {
  foreignKey: 'user_id',
  as: 'comments'
});
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
});

// User - Like (1:N) - Si existe el modelo Like
if (typeof Like !== 'undefined') {
  User.hasMany(Like, {
    foreignKey: 'user_id',
    as: 'likes'
  });
  Like.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  Post.hasMany(Like, {
    foreignKey: 'post_id',
    as: 'likes'
  });
  Like.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post'
  });
}
*/

// ============================================
// SINCRONIZAR BASE DE DATOS
// ============================================

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    console.log('🔄 Sincronizando base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa');
    
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
  Comment,
  // Exporta cuando estén disponibles:
  // User,
  // Post,
  // Like
};

export default sequelize;
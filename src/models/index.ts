/**
 * MODELS INDEX - Configuración y relaciones
 */

import sequelize from '../database/database';
import { Comment } from './Comment';
import { User } from './User';

// NOTA: Estas importaciones darán error temporal hasta que tus compis
// desarrollen sus modelos. Es NORMAL y esperado.
// @ts-ignore - Importación temporal hasta que se desarrollen los modelos
import Post from './Post';
// @ts-ignore - Importación temporal hasta que se desarrollen los modelos
// import Like from './Like'; // Importación temporal hasta que se desarrolle el modelo

// ============================================
// FUNCIÓN DE CONFIGURACIÓN DE RELACIONES
// ============================================

/**
 * Configura las asociaciones (relaciones) entre los modelos de Sequelize.
 * Se llama desde server.ts después de autenticar la conexión a DB.
 */
export const setupAssociations = (): void => {
    console.log('🔗 Configurando asociaciones de modelos...');
    
    // ============================================
    // ASOCIACIONES ACTIVAS
    // ============================================

    // User - Comment (1:N)
    User.hasMany(Comment, {
        foreignKey: 'user_id',
        as: 'comments'
    });
    Comment.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'author'
    });

    // ============================================
    // ASOCIACIONES PENDIENTES (Post no disponible aún)
    // ============================================
    
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

    // User - Like (1:N) - Si existe el modelo Like
    // @ts-ignore - La importación de Like puede no existir
    if (typeof Like !== 'undefined') {
        // @ts-ignore 
        User.hasMany(Like, {
            foreignKey: 'user_id',
            as: 'likes'
        });
        // @ts-ignore 
        Like.belongsTo(User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        // @ts-ignore 
        Post.hasMany(Like, {
            foreignKey: 'post_id',
            as: 'likes'
        });
        // @ts-ignore 
        Like.belongsTo(Post, {
            foreignKey: 'post_id',
            as: 'post'
        });
    }
    */
    
    console.log('✅ Asociaciones configuradas: User <-> Comment');
    console.log('⏳ Pendientes: Post, Like (cuando estén disponibles)');
};


// ============================================
// SINCRONIZAR BASE DE DATOS (Función auxiliar)
// ============================================

export const syncDatabase = async (force: boolean = false): Promise<void> => {
    try {
        console.log('🔄 Sincronizando base de datos...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a base de datos exitosa');
        
        // Sincronizar todos los modelos definidos, incluyendo Comment y User
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
    User,
    // Post,    // Pendiente
    // Like     // Pendiente
};

export default sequelize;
// src/models/index.ts
/**
 * MODELS INDEX - Configuración y relaciones
 */

import sequelize from '../database/database';
import { Comment } from './Comment';
import { User } from './User';
import Fossil from './GobModelPost'; // El modelo Post/Fossil
import { Like } from './Like';

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
    // RELACIÓN: User <-> Fossil (Post)
    // users → posts (1:N) via author_id
    // ============================================

    User.hasMany(Fossil, {
        foreignKey: 'author_id',
        as: 'posts'
    });

    Fossil.belongsTo(User, {
        foreignKey: 'author_id',
        as: 'author'
    });

    // ============================================
    // RELACIÓN: User <-> Comment
    // users → comments (1:N) via user_id
    // ============================================

    User.hasMany(Comment, {
        foreignKey: 'user_id',
        as: 'comments'
    });

    Comment.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'author'
    });

    // ============================================
    // RELACIÓN: Fossil (Post) <-> Comment
    // posts → comments (1:N) via post_id
    // ============================================

    Fossil.hasMany(Comment, {
        foreignKey: 'post_id',
        as: 'comments'
    });

    Comment.belongsTo(Fossil, {
        foreignKey: 'post_id',
        as: 'post'
    });

    // ============================================
    // RELACIÓN: User <-> Like
    // users → likes (1:N) via user_id
    // ============================================

    User.hasMany(Like, {
        foreignKey: 'user_id',
        as: 'likes'
    });

    Like.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // ============================================
    // RELACIÓN: Fossil (Post) <-> Like
    // posts → likes (1:N) via post_id
    // ============================================

    Fossil.hasMany(Like, {
        foreignKey: 'post_id',
        as: 'likes'
    });

    Like.belongsTo(Fossil, {
        foreignKey: 'post_id',
        as: 'post'
    });

    console.log('✅ Asociaciones configuradas:');
    console.log('   - User <-> Fossil (Post)');
    console.log('   - User <-> Comment');
    console.log('   - Fossil (Post) <-> Comment');
    console.log('   - User <-> Like');
    console.log('   - Fossil (Post) <-> Like');
};

// ============================================
// SINCRONIZAR BASE DE DATOS (Función auxiliar)
// ============================================

export const syncDatabase = async (force: boolean = false): Promise<void> => {
    try {
        console.log('🔄 Sincronizando base de datos...');

        await sequelize.authenticate();
        console.log('✅ Conexión a base de datos exitosa');

        // Configurar asociaciones antes de sincronizar
        setupAssociations();

        // Sincronizar todos los modelos definidos
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
    Fossil,      // También lo puedes llamar Post si prefieres
    Comment,
    Like
};

// Alias para que sea más semántico
export const Post = Fossil;

export default sequelize;

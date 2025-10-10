// src/models/index.ts
/**
 * MODELS INDEX - Sequelize-TypeScript
 *
 * Con sequelize-typescript, los modelos se cargan automáticamente
 * desde database.ts usando la opción 'models: [path]'
 *
 * Las relaciones están definidas con decoradores en cada modelo.
 * NO es necesario llamar a setupAssociations()
 */

// Importaciones para re-exportar y acceso (ya no son para definir asociaciones)
import sequelize from '../database/database';
import { User } from './User';
import Fossil from './GobModelPost';
import { Comment } from './Comment';
import { Like } from './Like';

// ============================================
// FUNCIÓN DE LOGGING (OPCIONAL)
// ============================================

/**
 * Con sequelize-typescript, las asociaciones ya están definidas
 * en cada modelo con decoradores (@HasMany, @BelongsTo, etc.)
 * Esta función solo muestra información para debug.
 */
export const setupAssociations = (): void => {
    console.log('🔗 Modelos con decoradores cargados automáticamente');
    // ⚠️ NO hacemos nada aquí, solo logging
};

// ============================================
// SINCRONIZAR BASE DE DATOS
// ============================================
// NOTA: Si esta función solo se usaba con la instancia 'sequelize' antigua,
// seguirá funcionando ya que la nueva instancia de sequelize-typescript
// mantiene la función .sync() y ya conoce los modelos.

export const syncDatabase = async (force: boolean = false): Promise<void> => {
    try {
        console.log('🔄 Sincronizando base de datos...');

        await sequelize.authenticate();
        console.log('✅ Conexión a base de datos exitosa');

        // ⚠️ NO llamamos setupAssociations() porque no hace nada
        // Los modelos ya están registrados automáticamente

        // Sincronizar todos los modelos
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
    Fossil,
    Comment,
    Like
};

// Alias para mantener compatibilidad
export const Post = Fossil;

export default sequelize;

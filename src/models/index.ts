/**
 * MODELS INDEX - Re-exportación de modelos migrados
 * * NOTA: La función setupAssociations() se elimina porque las relaciones
 * se definen con decoradores (@HasMany, @BelongsTo) dentro de cada modelo.
 */

// Importaciones para re-exportar y acceso (ya no son para definir asociaciones)
import sequelize from '../database/database';
import { Comment } from './Comment';
import { User } from './User';
// Importaciones pendientes:
// import { Post } from './Post';
// import { Like } from './Like'; 

// ============================================
// FUNCIÓN DE CONFIGURACIÓN DE RELACIONES
// ============================================

// TODO: ESTA FUNCIÓN DEBE SER ELIMINADA CUANDO TODOS LOS MODELOS HAYAN SIDO MIGRADOS.
// Mientras tanto, se puede mantener vacía o eliminada si las nuevas asociaciones
// con decoradores ya están definidas en los modelos User y Comment.

export const setupAssociations = (): void => {
    console.log('🔗 Asociaciones ahora definidas con decoradores en los modelos.');
    // Si necesitas garantizar que todas las clases se carguen (aunque database.ts ya lo hace):
    // const models = sequelize.modelManager.all; 
    // console.log(`Modelos cargados: ${Object.keys(models).join(', ')}`);
    console.log('✅ Configuración de asociaciones (obsoleta) omitida.');
};


// ============================================
// SINCRONIZAR BASE DE DATOS (Se mantiene, si es usada)
// ============================================
// NOTA: Si esta función solo se usaba con la instancia 'sequelize' antigua,
// seguirá funcionando ya que la nueva instancia de sequelize-typescript
// mantiene la función .sync() y ya conoce los modelos.

export const syncDatabase = async (force: boolean = false): Promise<void> => {
    try {
        console.log('🔄 Sincronizando base de datos...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a base de datos exitosa');
        
        // sequelize-typescript usa .sync() y automáticamente incluye los modelos cargados
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
    Comment, // Solo si los necesitas acceder globalmente
    User,    // Solo si los necesitas acceder globalmente
    // Post,  // Migrar y añadir aquí
    // Like   // Migrar y añadir aquí
};

export default sequelize;
/**
 * CONFIGURACIÓN DE TESTS - SEQUELIZE-TYPESCRIPT
 *
 * Inicializa la base de datos de test
 */

import { config } from 'dotenv';
import sequelize from '../database/database';

// ✅ Importar todos los modelos para que se registren
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import Fossil from '../models/Posts';
import { Like } from '../models/Like';

// Cargar variables de entorno
config();

// ✅ IMPORTANTE: Forzar NODE_ENV a test
process.env.NODE_ENV = 'test';

/**
 * Con sequelize-typescript, las asociaciones ya están definidas
 * en los decoradores de cada modelo. No necesitamos setupAssociations.
 */

// ============================================
// HOOKS DE JEST
// ============================================

/**
 * Antes de TODOS los tests
 * Se ejecuta una sola vez al inicio
 */
beforeAll(async () => {
  try {
    console.log('\n🧪 ========================================');
    console.log('INICIANDO TESTS - SETUP (SEQUELIZE-TYPESCRIPT)');
    console.log('========================================\n');

    // Conectar a la base de datos de test
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos de test');
    console.log(`📊 Database: ${process.env.DB_TEST_NAME || 'game_of_bones_app_test'}`);

    // ✅ Con sequelize-typescript, los modelos ya están registrados automáticamente
    console.log('📦 Modelos cargados automáticamente vía decoradores');

    // Sincronizar modelos (recrear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas en la base de datos de test\n');

  } catch (error) {
    console.error('❌ Error en setup de tests:', error);
    throw error;
  }
});

/**
 * Después de TODOS los tests
 * Se ejecuta una sola vez al final
 */
afterAll(async () => {
  try {
    console.log('\n🧹 Limpiando y cerrando conexión...');

    // Cerrar conexión
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');

    console.log('\n========================================');
    console.log('TESTS FINALIZADOS');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
  }
});

/**
 * Después de CADA test individual (opcional)
 * Útil para limpiar datos entre tests
 */
afterEach(async () => {
  // ⚠️ COMENTADO por defecto para que cada test tenga sus propios datos
  // Descomentar si quieres limpiar la BD después de cada test:

  /*
  try {
    // Limpiar todas las tablas (en orden inverso a las FK)
    await Like.destroy({ where: {}, force: true });
    await Comment.destroy({ where: {}, force: true });
    await Fossil.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
  } catch (error) {
    console.error('Error al limpiar datos entre tests:', error);
  }
  */
});

/**
 * Timeout global para operaciones de BD
 */
jest.setTimeout(10000); // 10 segundos

// ============================================
// OPCIONAL: Silenciar logs durante tests
// ============================================

// Descomentar para silenciar console.log durante tests:
/*
global.console = {
  ...console,
  log: jest.fn(),    // Silencia console.log
  debug: jest.fn(),  // Silencia console.debug
  info: jest.fn(),   // Silencia console.info
  warn: jest.fn(),   // Silencia console.warn
  // error se mantiene para ver errores reales
};
*/

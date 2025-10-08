/**
 * CONFIGURACIÓN DE TESTS
 * 
 * Inicializa la base de datos de test y configura el entorno
 */

import { config } from 'dotenv';
import sequelize from '../config/database';

// Cargar variables de entorno
config();

// Función para configurar asociaciones (por ahora vacía)
export const setupAssociations = (): void => {
  // Esta función configurará las asociaciones cuando todos los modelos existan
  // Por ahora la dejamos vacía para evitar errores
  
  // Cuando User y Post existan, aquí irán las asociaciones:
  /*
  User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
  Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
  
  Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
  Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
  
  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
  */
};

// Configurar asociaciones al inicio
setupAssociations();

// Antes de todos los tests
beforeAll(async () => {
  try {
    // Conectar a la base de datos de test
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos de test');
    
    // Sincronizar modelos (recrear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas en la base de datos de test');
  } catch (error) {
    console.error('❌ Error en setup de tests:', error);
    throw error;
  }
});

// Después de todos los tests
afterAll(async () => {
  try {
    // Cerrar conexión
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
  }
});

// Limpiar base de datos después de cada test (opcional)
afterEach(async () => {
  // Opcional: limpiar datos entre tests
  // await sequelize.truncate({ cascade: true, restartIdentity: true });
});
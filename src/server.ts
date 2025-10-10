/**
 * PUNTO DE ENTRADA DEL SERVIDOR
 * Inicializa y arranca el servidor Express con Sequelize-TypeScript
 */

import 'reflect-metadata'; // ✅ CRÍTICO: Necesario para decoradores
import dotenv from 'dotenv';
dotenv.config();

import app, { logServerBanner } from './app';
import sequelize, { testConnection } from './database/database';
import './models'; // ✅ Importar modelos para que se registren automáticamente

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Determinar qué base de datos se está usando
const getDbName = () => {
  if (NODE_ENV === 'test') {
    return process.env.DB_TEST_NAME || 'game_of_bones_app_test';
  }
  return process.env.DB_NAME || 'game_of_bones_app';
};

const startServer = async () => {
  try {
    console.log('\n🦴 ========================================');
    console.log('INICIANDO SERVIDOR - SEQUELIZE-TYPESCRIPT');
    console.log('========================================\n');

    // 1. Probar conexión a la base de datos
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // 2. Sincronizar modelos con la BD
    console.log('🔄 Sincronizando modelos...');
    // ⚠️ IMPORTANTE: En producción, NUNCA usar force: true
    // ⚠️ IMPORTANTE: En producción, NUNCA usar force: true
    if (NODE_ENV === 'development') {
      // Desactivar verificación de foreign keys temporalmente
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // 👇 BORRAR TABLA POSTS FANTASMA
      await sequelize.query('DROP TABLE IF EXISTS posts');

      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } else if (NODE_ENV === 'test') {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync();
    }

    console.log('✅ Modelos sincronizados con la base de datos\n');

    // 3. Iniciar servidor
    app.listen(PORT, () => {

      // 🦴 Mostrar el banner ASCII
      logServerBanner(PORT);

      // Logs de información detallada
      console.log('🚀 Servidor corriendo en puerto', PORT);
      console.log(`📁 Ambiente: ${NODE_ENV}`);
      console.log(`🗄️  Base de datos: ${getDbName()}`);
      console.log('🔗 Health check:', `http://localhost:${PORT}/health`);
      console.log('🔗 API:', `http://localhost:${PORT}/gameofbones`);

      // Emoji según el ambiente
      if (NODE_ENV === 'test') {
        console.log('🧪 Modo TEST activado');
      } else if (NODE_ENV === 'production') {
        console.log('🏭 Modo PRODUCCIÓN activado');
      } else {
        console.log('🛠️  Modo DESARROLLO activado');
      }

      console.log('\n💡 Endpoints disponibles:');
      console.log('   POST   /gameofbones/auth/register');
      console.log('   POST   /gameofbones/auth/login');
      console.log('   GET    /gameofbones/users');
      console.log('   GET    /gameofbones/api/fossils');
      console.log('   GET    /gameofbones/posts/:postId/comments');
      console.log('   POST   /gameofbones/api/posts/:postId/like');
      console.log('');
    });

  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('ERROR AL INICIAR EL SERVIDOR');
    console.error('========================================');
    console.error(error);
    console.error('========================================\n');
    process.exit(1);
  }
};

startServer();

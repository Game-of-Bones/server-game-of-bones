/**
 * SERVER ENTRY POINT
 *
 * Punto de entrada del servidor
 * Inicializa conexión a BD y arranca Express
 */

import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize, { testConnection } from './database/database';
import './models';

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Banner ASCII para la consola
 */
const SERVER_BANNER = `
╔═══════════════════════════════════════════════╗
║                                               ║
║           🦴 GAME OF BONES API 🦴             ║
║                                               ║
║      Server running on http://localhost:${PORT}  ║
║                                               ║
╚═══════════════════════════════════════════════╝
`;

/**
 * Determinar nombre de la base de datos según entorno
 */
const getDbName = () => {
  if (NODE_ENV === 'test') {
    return process.env.DB_TEST_NAME || 'game_of_bones_app_test';
  }
  return process.env.DB_NAME || 'game_of_bones_app';
};

/**
 * Iniciar servidor
 */
const startServer = async () => {
  try {
    console.log('🔧 Iniciando Game of Bones API...\n');

    // 1. Conectar a la base de datos
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // 2. Sincronizar modelos
    console.log('📊 Sincronizando modelos con la base de datos...');
    await sequelize.sync({
      alter: NODE_ENV === 'development',
      force: false,
    });
    console.log('✅ Modelos sincronizados\n');

    // 3. Iniciar servidor HTTP
    app.listen(PORT, () => {
      // Banner ASCII
      console.log(SERVER_BANNER);

      // Información del servidor
      console.log('📍 Información del servidor:');
      console.log(`   Puerto: ${PORT}`);
      console.log(`   Ambiente: ${NODE_ENV}`);
      console.log(`   Base de datos: ${getDbName()}`);
      console.log('');

      // Endpoints disponibles
      console.log('🔗 Endpoints disponibles:');
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   API root: http://localhost:${PORT}/api`);
      console.log(`   Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   Posts: http://localhost:${PORT}/api/posts`);
      console.log('');

      // Estado según ambiente
      if (NODE_ENV === 'test') {
        console.log('🧪 Modo TEST activado');
      } else if (NODE_ENV === 'production') {
        console.log('🏭 Modo PRODUCCIÓN activado');
      } else {
        console.log('🛠️  Modo DESARROLLO activado');
      }
      console.log('\n✨ Servidor listo para recibir peticiones\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar
startServer();

/**
 * PUNTO DE ENTRADA DEL SERVIDOR
 * 
 * Inicializa y arranca el servidor Express
 */

import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize, { testConnection } from './database/database';
import './models'; // Importar modelos para registrarlos

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
    // 1. Probar conexión a la base de datos
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // 2. Sincronizar modelos con la BD (sin force en producción)
    console.log('🔗 Configurando asociaciones de modelos...');
    console.log('✅ Asociaciones preparadas (comentadas hasta modelos existentes)');
    console.log('✅ Asociaciones de modelos configuradas');
    
    await sequelize.sync({ alter: NODE_ENV === 'development' });
    console.log('✅ Modelos sincronizados con la base de datos\n');

    // 3. Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor corriendo en puerto', PORT);
      console.log(`📍 Ambiente: ${NODE_ENV}`);
      console.log(`🗄️  Base de datos: ${getDbName()}`);
      console.log('🔗 Health check:', `http://localhost:${PORT}/health`);
      console.log('🔗 API:', `http://localhost:${PORT}/gameofbones`);
      
      // Emoji especial según el ambiente
      if (NODE_ENV === 'test') {
        console.log('🧪 Modo TEST activado');
      } else if (NODE_ENV === 'production') {
        console.log('🏭 Modo PRODUCCIÓN activado');
      } else {
        console.log('🛠️  Modo DESARROLLO activado');
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { setupAssociations } from './models';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Función para probar la conexión a la base de datos
 */
const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    return false;
  }
};

/**
 * Iniciar el servidor
 */
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Configurar asociaciones
    setupAssociations();
    console.log('✅ Asociaciones de modelos configuradas');

    // Sincronizar modelos (sin force en producción)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API: http://localhost:${PORT}/gameofbones\n`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on('SIGINT', async () => {
  console.log('\n⚠️  Recibida señal de interrupción');
  await sequelize.close();
  console.log('✅ Conexión a la base de datos cerrada');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Recibida señal de terminación');
  await sequelize.close();
  console.log('✅ Conexión a la base de datos cerrada');
  process.exit(0);
});

// Iniciar servidor
startServer();
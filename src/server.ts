// src/server.ts
import app from './app';
import { testConnection } from './config/database';
import dotenv from 'dotenv';

dotenv.config();
import app from './app';
// NOTA: Se asume que testConnection se exporta desde database.ts
import sequelize, { testConnection } from './config/database';
import { setupAssociations } from './models';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1);
  }
};

startServer();
    try {
        // Probar conexión a la base de datos
        // NOTA: Este testConnection debe estar disponible en '../config/database'
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }

        // Configurar asociaciones
        // Esto usa la función que exportamos en models/index.ts
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
            console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGINT', async () => {
    console.log('\n⚠️  Recibida señal de interrupción');
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️  Recibida señal de terminación');
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
    process.exit(0);
});

// Iniciar servidor
startServer();

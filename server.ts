// src/server.ts
import app from './app';
import { testConnection } from './config/database';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Función para iniciar el servidor
 */
async function startServer() {
  try {
    // 1. Probar conexión a la base de datos
    console.log('🔌 Conectando a la base de datos...');
    await testConnection();
    console.log('✅ Base de datos conectada\n');

    // 2. Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🦴 Game of Bones API`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('💥 Cerrando aplicación...');
    process.exit(1); // Salir con código de error
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

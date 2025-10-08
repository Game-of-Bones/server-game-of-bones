/**
 * APP.TS - Inicialización de Express con Sequelize
 * 
 * Configuración principal de la aplicación
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { syncDatabase } from './models';
import router from './router';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// ============================================
// MIDDLEWARES
// ============================================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS
// ============================================
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Game of Bones API is running'
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

// ============================================
// INICIALIZACIÓN
// ============================================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sincronizar base de datos (sin eliminar datos existentes)
    await syncDatabase(false);
    
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║         🦴 GAME OF BONES API 🦴              ║
║                                               ║
║  Server running on http://localhost:${PORT}   ║
║                                               ║
╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;
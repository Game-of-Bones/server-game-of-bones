/**
 * * Configuración principal de la aplicación
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { syncDatabase } from './models'; // Reintroducido para la estructura inicial
import router from './router';
// @ts-ignore
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
// Ruta base cambiada a /gameofbones
app.use('/gameofbones', router);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        // Mensaje de bienvenida actualizado
        message: '¡Bienvenido a la Game of Bones API! La ruta principal para los endpoints es /gameofbones'
    });
});

// Function to start the server
const startServer = async () => {
  try {
    // Test database connection before starting server
    await testConnection();

    // If DB connection successful, start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1); // Exit if database connection fails
  }
};

// Execute the start function
startServer();

export default app;


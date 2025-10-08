// src/app.ts
/**
 * Configuración principal de la aplicación
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

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
    message: '¡Bienvenido a la Game of Bones API!'
  });
});

// ============================================
// MANEJO DE ERRORES (comentado hasta que tengas el middleware)
// ============================================
// Middleware de manejo de errores - debe ir al final
// app.use(errorHandler);

// Ruta 404 - debe ir al final antes del errorHandler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app;
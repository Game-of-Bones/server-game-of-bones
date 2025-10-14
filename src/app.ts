/**
 * APP CONFIGURATION
 *
 * Configuración principal de Express
 * Middlewares, rutas y manejo de errores
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';
import { corsConfig } from './config/cors';
import { handleError, notFound } from './middleware/handleError';

const app: Application = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad
app.use(helmet());

// CORS configurado
app.use(cors(corsConfig));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS
// ============================================

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Game of Bones API is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * API root - información de bienvenida
 * GET /api
 */
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Game of Bones API',
    version: '1.0.0',
    description: 'API REST para Blog de Paleontología',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      likes: '/api/likes',
    },
    documentation: 'https://github.com/Game-of-Bones/server-game-of-bones',
  });
});

/**
 * Todas las rutas de la API
 * Base path: /api
 */
app.use('/api', router);

// ============================================
// MANEJO DE ERRORES
// ============================================

/**
 * 404 - Ruta no encontrada
 * DEBE ir ANTES de handleError
 */
app.use(notFound);

/**
 * Error handler global
 * DEBE ir AL FINAL de todo
 */
app.use(handleError);

export default app;

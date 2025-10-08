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
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: '¡Bienvenido a la Game of Bones API!'
  });
});

// Ruta raíz de la API - muestra información de bienvenida
app.get('/gameofbones', (req, res) => {
  res.json({
    success: true,
    message: 'Game of Bones API',
    version: '1.0.0',
    description: 'API REST para Blog de Paleontología',
    endpoints: {
      health: '/health',
      users: '/gameofbones/users',
      posts: '/gameofbones/posts',
      comments: '/gameofbones/comments',
      tags: '/gameofbones/tags',
      categories: '/gameofbones/categories'
    },
    documentation: 'https://github.com/Game-of-Bones/server-game-of-bones'
  });
});

// Todas las rutas de la API
app.use('/gameofbones', router);

// ============================================
// MANEJO DE ERRORES
// ============================================
// Middleware de manejo de errores - debe ir al final
// app.use(errorHandler);

// Ruta 404 - debe ir al final antes del errorHandler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    availableEndpoints: {
      health: '/health',
      api: '/gameofbones',
      users: '/gameofbones/users',
      posts: '/gameofbones/posts',
      comments: '/gameofbones/comments'
    }
  });
});

export default app;
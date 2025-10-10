// src/app.ts
/**
 * Configuración principal de la aplicación
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';
import { handleError } from './middleware/handleError';

const PORT = process.env.PORT || 3000;

// ============================================
// BANNER ASCII
// ============================================

const SERVER_BANNER = `
╔═══════════════════════════════════════════════╗
║                                               ║
║           🦴 GAME OF BONES API 🦴             ║
║                                               ║
║      Server running on http://localhost:${PORT}  ║
║                                               ║
╚═══════════════════════════════════════════════╝
`;

export const logServerBanner = (actualPort: number | string = PORT) => {
    const banner = SERVER_BANNER.replace(`:${PORT}`, `:${actualPort}`);
    console.log(banner);
};

const app: Application = express();

// ============================================
// MIDDLEWARES GLOBALES
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
    message: '¡Bienvenido a la Game of Bones API!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz de la API
app.get('/gameofbones', (req, res) => {
  res.json({
    success: true,
    message: 'Game of Bones API',
    version: '1.0.0',
    description: 'API REST para Blog de Paleontología',
    endpoints: {
      health: '/health',
      auth: '/gameofbones/auth',
      users: '/gameofbones/users',
      posts: '/gameofbones/posts',
      comments: '/gameofbones/comments',
      likes: '/gameofbones/likes'
    },
    documentation: 'https://github.com/Game-of-Bones/server-game-of-bones'
  });
});

// Todas las rutas de la API
app.use('/gameofbones', router);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta 404 - debe ir ANTES del errorHandler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
    availableEndpoints: {
      health: '/health',
      api: '/gameofbones',
      users: '/gameofbones/users',
      posts: '/gameofbones/posts',
      comments: '/gameofbones/comments',
      likes: '/gameofbones/likes'
    }
  });
});

// ✅ Middleware de manejo de errores - DEBE IR AL FINAL
app.use(handleError);

export default app;
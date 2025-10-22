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
 * 🦴 WELCOME ROUTE - Ruta raíz
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    message: '🦴 Bienvenido a Game of Bones API',
    version: '1.0.0',
    description: 'API RESTful para compartir descubrimientos paleontológicos del mundo',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: 'https://github.com/Game-of-Bones/server-game-of-bones'
    },
    team: [
      { name: 'Ana', role: 'Full Stack Developer', github: 'https://github.com/ana-username' },
      { name: 'MariCarmen', role: 'Full Stack Developer', github: 'https://github.com/maricarmen-username' },
      { name: 'Ingrid', role: 'Full Stack Developer', github: 'https://github.com/ingrid-username' },
      { name: 'Nicole', role: 'Full Stack Developer', github: 'https://github.com/nicole-username' },
      { name: 'Esther', role: 'Full Stack Developer', github: 'https://github.com/esther-username' }
    ]
  });
});

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
 * API root - Documentación detallada de endpoints
 * GET /api
 */
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🦴 Game of Bones API - Documentación',
    version: '1.0.0',
    description: 'API REST para Blog de Paleontología',
    baseUrl: '/api',
    documentation: {
      auth: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Registrar nuevo usuario',
          auth: false
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Iniciar sesión',
          auth: false
        }
      },
      posts: {
        getAll: {
          method: 'GET',
          path: '/api/posts',
          description: 'Obtener todos los posts (con filtros y paginación)',
          queryParams: '?status=published&fossil_type=bones_teeth&page=1&limit=10',
          auth: false
        },
        getById: {
          method: 'GET',
          path: '/api/posts/:id',
          description: 'Obtener post por ID',
          auth: false
        },
        create: {
          method: 'POST',
          path: '/api/posts',
          description: 'Crear nuevo post',
          auth: true
        },
        update: {
          method: 'PUT',
          path: '/api/posts/:id',
          description: 'Actualizar post (autor o admin)',
          auth: true
        },
        delete: {
          method: 'DELETE',
          path: '/api/posts/:id',
          description: 'Eliminar post - soft delete (autor o admin)',
          auth: true
        }
      },
      comments: {
        getByPost: {
          method: 'GET',
          path: '/api/posts/:postId/comments',
          description: 'Obtener comentarios de un post',
          auth: false
        },
        create: {
          method: 'POST',
          path: '/api/posts/:postId/comments',
          description: 'Crear comentario en un post',
          auth: true
        },
        getById: {
          method: 'GET',
          path: '/api/comments/:id',
          description: 'Ver un comentario específico',
          auth: false
        },
        update: {
          method: 'PUT',
          path: '/api/comments/:id',
          description: 'Actualizar comentario (solo autor)',
          auth: true
        },
        delete: {
          method: 'DELETE',
          path: '/api/comments/:id',
          description: 'Eliminar comentario (autor o admin)',
          auth: true
        },
        getByUser: {
          method: 'GET',
          path: '/api/users/:userId/comments',
          description: 'Obtener comentarios de un usuario',
          auth: false
        }
      },
      likes: {
        toggle: {
          method: 'POST',
          path: '/api/posts/:postId/like',
          description: 'Dar/quitar like a un post (toggle)',
          auth: true
        }
      }
    },
    github: 'https://github.com/Game-of-Bones/server-game-of-bones',
    team: [
      { name: 'Ana', role: 'Full Stack Developer' },
      { name: 'MariCarmen', role: 'Full Stack Developer' },
      { name: 'Ingrid', role: 'Full Stack Developer' },
      { name: 'Nicole', role: 'Full Stack Developer' },
      { name: 'Esther', role: 'Full Stack Developer' }
    ]
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
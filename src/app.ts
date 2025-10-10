/**
 * Configuración principal de la aplicación
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

// Definimos un puerto predeterminado para el banner. El valor real se tomaría en el archivo de inicio.
const PORT = process.env.PORT || 3000;

// ============================================
// BANNER ASCII (El dibujo solicitado)
// ============================================

// Definición del banner ASCII para la consola.
// Usamos backticks para soportar múltiples líneas y la interpolación de variables.
const SERVER_BANNER = `
╔═══════════════════════════════════════════════╗
║                                               ║
║           🦴 GAME OF BONES API 🦴             ║
║                                               ║
║      Server running on http://localhost:${PORT}  ║
║                                               ║
╚═══════════════════════════════════════════════╝
`;

// Función que exportamos para que el archivo de inicio (ej. index.ts)
// pueda llamar y mostrar el banner en la consola.
export const logServerBanner = (actualPort: number | string = PORT) => {
    // Reemplazamos el PORT predeterminado en el string con el PORT real si es necesario.
    const banner = SERVER_BANNER.replace(`:${PORT}`, `:${actualPort}`);
    console.log(banner);
};

const app: Application = express();

// ============================================
// MIDDLEWARES
// ============================================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/gameofbones', router);

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

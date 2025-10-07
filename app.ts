// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

// Crear aplicación Express
const app: Application = express();

// ==================== MIDDLEWARES GLOBALES ====================

// Seguridad básica con Helmet
app.use(helmet());

// CORS - permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL de tu React
  credentials: true
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Parsear URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Logger de peticiones HTTP (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== RUTAS ====================

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas principales de la API
app.use('/api', routes);

// Ruta 404 - No encontrada
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// ==================== MANEJO DE ERRORES ====================

// Error handler global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Exportar app (NO iniciar el servidor aquí)
export default app;

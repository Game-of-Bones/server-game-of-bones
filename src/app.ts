<<<<<<< HEAD
import express from 'express';
import dotenv from 'dotenv';
<<<<<<< HEAD
import pool, { testConnection } from './config/database';
// Importamos el router de comentarios
import { createCommentsRouter } from '../src/routes/comments';
import likesRoutes from '../src/routes/likes';
// import authRouter from './routes/auth.routes'; // Para el futuro

=======
import { testConnection } from './config/database';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
>>>>>>> 403299b0eff80405ab06c85f01073d16b379e6fb
// Load environment variables
dotenv.config();
=======
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
>>>>>>> 5d2abea58a4f5537dffb53d19f27c22d017c7704

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

// ============================================
// ERROR HANDLER
// ============================================
//app.use(errorHandler);

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
║ Server running on http://localhost:${PORT}    ║
║                                               ║
╚═══════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor
startServer();

export default app;


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
app.use('/gameofbones', router);

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

// Iniciar servidor
startServer();

export default app;

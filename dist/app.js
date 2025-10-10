"use strict";
/**
 * Configuración principal de la aplicación
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logServerBanner = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const router_1 = __importDefault(require("./router"));
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
const logServerBanner = (actualPort = PORT) => {
    // Reemplazamos el PORT predeterminado en el string con el PORT real si es necesario.
    const banner = SERVER_BANNER.replace(`:${PORT}`, `:${actualPort}`);
    console.log(banner);
};
exports.logServerBanner = logServerBanner;
const app = (0, express_1.default)();
// ============================================
// MIDDLEWARES
// ============================================
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/gameofbones', router_1.default);
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
app.use('/gameofbones', router_1.default);
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
exports.default = app;
//# sourceMappingURL=app.js.map
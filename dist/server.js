"use strict";
/**
 * PUNTO DE ENTRADA DEL SERVIDOR
 * * Inicializa y arranca el servidor Express
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Se importa la función logServerBanner junto con la instancia de app
const app_1 = __importStar(require("./app"));
const database_1 = __importStar(require("./database/database"));
require("./models"); // Importar modelos para registrarlos
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Determinar qué base de datos se está usando
const getDbName = () => {
    if (NODE_ENV === 'test') {
        return process.env.DB_TEST_NAME || 'game_of_bones_app_test';
    }
    return process.env.DB_NAME || 'game_of_bones_app';
};
const startServer = async () => {
    try {
        // 1. Probar conexión a la base de datos
        const isConnected = await (0, database_1.testConnection)();
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }
        // 2. Sincronizar modelos con la BD (sin force en producción)
        console.log('🔗 Configurando asociaciones de modelos...');
        console.log('✅ Asociaciones preparadas (comentadas hasta modelos existentes)');
        console.log('✅ Asociaciones de modelos configuradas');
        await database_1.default.sync({ alter: NODE_ENV === 'development' });
        console.log('✅ Modelos sincronizados con la base de datos\n');
        // 3. Iniciar servidor
        app_1.default.listen(PORT, () => {
            // 🦴 Mostrar el banner ASCII al iniciar el servidor 🦴
            (0, app_1.logServerBanner)(PORT);
            // Logs de información detallada
            console.log('🚀 Servidor corriendo en puerto', PORT);
            console.log(`📍 Ambiente: ${NODE_ENV}`);
            console.log(`🗄️  Base de datos: ${getDbName()}`);
            console.log('🔗 Health check:', `http://localhost:${PORT}/health`);
            console.log('🔗 API:', `http://localhost:${PORT}/gameofbones`);
            // Emoji especial según el ambiente
            if (NODE_ENV === 'test') {
                console.log('🧪 Modo TEST activado');
            }
            else if (NODE_ENV === 'production') {
                console.log('🏭 Modo PRODUCCIÓN activado');
            }
            else {
                console.log('🛠️  Modo DESARROLLO activado');
            }
            console.log('');
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map
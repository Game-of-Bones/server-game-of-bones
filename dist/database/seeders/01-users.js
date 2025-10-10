"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearUsers = exports.seedUsers = void 0;
// src/database/seeders/01-users.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../models/User");
/**
 * Seeder para crear usuarios de prueba
 */
const seedUsers = async () => {
    try {
        console.log('🌱 Iniciando seed de usuarios...');
        // Verificar si ya existen usuarios
        const existingUsers = await User_1.User.count();
        if (existingUsers > 0) {
            console.log('ℹ️  Ya existen usuarios en la base de datos. Saltando seed...');
            return;
        }
        // Crear usuarios de prueba
        const users = [
            {
                username: 'admin',
                email: 'admin@gameofbones.com',
                password_hash: await bcrypt_1.default.hash('admin123', 12),
                role: 'admin'
            },
            {
                username: 'maria_fossil',
                email: 'maria@example.com',
                password_hash: await bcrypt_1.default.hash('password123', 12),
                role: 'user'
            },
            {
                username: 'carlos_dino',
                email: 'carlos@example.com',
                password_hash: await bcrypt_1.default.hash('password123', 12),
                role: 'user'
            },
            {
                username: 'pepita_paleo',
                email: 'pepita@example.com',
                password_hash: await bcrypt_1.default.hash('password123', 12),
                role: 'user'
            },
            {
                username: 'luis_rex',
                email: 'luis@example.com',
                password_hash: await bcrypt_1.default.hash('password123', 12),
                role: 'user'
            }
        ];
        await User_1.User.bulkCreate(users);
        console.log('✅ Usuarios creados exitosamente:');
        console.log('   - admin@gameofbones.com (admin) - password: admin123');
        console.log('   - maria@example.com (user) - password: password123');
        console.log('   - carlos@example.com (user) - password: password123');
        console.log('   - pepita@example.com (user) - password: password123');
        console.log('   - luis@example.com (user) - password: password123');
    }
    catch (error) {
        console.error('❌ Error al crear usuarios:', error);
        throw error;
    }
};
exports.seedUsers = seedUsers;
/**
 * Eliminar todos los usuarios (para testing)
 */
const clearUsers = async () => {
    try {
        await User_1.User.destroy({ where: {}, force: true });
        console.log('🗑️  Usuarios eliminados');
    }
    catch (error) {
        console.error('❌ Error al eliminar usuarios:', error);
        throw error;
    }
};
exports.clearUsers = clearUsers;
//# sourceMappingURL=01-users.js.map
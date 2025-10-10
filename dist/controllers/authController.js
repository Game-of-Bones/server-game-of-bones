"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validaciones básicas
        if (!username || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
            return;
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
            return;
        }
        // Validar longitud de contraseña
        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
            return;
        }
        // Verificar si el email ya existe (Sequelize)
        const existingEmail = await User_1.User.findOne({ where: { email } });
        if (existingEmail) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
            return;
        }
        // Verificar si el username ya existe (Sequelize)
        const existingUsername = await User_1.User.findOne({ where: { username } });
        if (existingUsername) {
            res.status(400).json({
                success: false,
                message: 'El username ya está en uso'
            });
            return;
        }
        // Hashear contraseña
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        // Crear usuario (Sequelize)
        const user = await User_1.User.create({
            username,
            email,
            password_hash: hashedPassword,
            role: 'user'
        });
        // Generar token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
};
exports.register = register;
/**
 * Iniciar sesión
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validaciones
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
            return;
        }
        // Buscar usuario (Sequelize)
        const user = await User_1.User.findOne({
            where: { email }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
            return;
        }
        // Verificar contraseña
        const validPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!validPassword) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
            return;
        }
        // Generar token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map
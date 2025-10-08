import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize'; 
import { CreateUserDTO, LoginDTO } from '../models/User';

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: CreateUserDTO = req.body;

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

    // Verificar si el email ya existe
    const existingUsers = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      {
        replacements: [email],
        type: QueryTypes.SELECT
      }
    );

    if (existingUsers.length > 0) {
      res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
      return;
    }

    // Verificar si el username ya existe
    const existingUsernames = await sequelize.query(
      'SELECT id FROM users WHERE username = ?',
      {
        replacements: [username],
        type: QueryTypes.SELECT
      }
    );

    if (existingUsernames.length > 0) {
      res.status(400).json({
        success: false,
        message: 'El username ya está en uso'
      });
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    await sequelize.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      {
        replacements: [username, email, hashedPassword, 'user']
      }
    );

    // Obtener usuario creado
    const users = await sequelize.query(
      'SELECT id, username, email, role, created_at FROM users WHERE email = ?',
      {
        replacements: [email],
        type: QueryTypes.SELECT
      }
    ) as any[];

    const user = users[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

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

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginDTO = req.body;

    // Validaciones
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
      return;
    }

    // Buscar usuario
    const users = await sequelize.query(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      {
        replacements: [email],
        type: QueryTypes.SELECT
      }
    ) as any[];

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    const user = users[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

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

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};
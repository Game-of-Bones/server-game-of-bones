// src/controllers/usersController.ts
// ⚠️ CREAR ESTE ARCHIVO EN: src/controllers/usersController.ts

import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

/**
 * Obtener todos los usuarios
 * GET /gameofbones/users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash', 'deleted_at'] },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
};

/**
 * Obtener usuario por ID
 * GET /gameofbones/users/:id
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user?.id;
    const requestingUserRole = req.user?.role;

    // Verificar permisos: solo el propio usuario o un admin puede ver detalles
    if (requestingUserId !== parseInt(id) && requestingUserRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este usuario'
      });
      return;
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash', 'deleted_at'] }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
};

/**
 * Actualizar usuario
 * PUT /gameofbones/users/:id
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const requestingUserId = req.user?.id;
    const requestingUserRole = req.user?.role;

    // Verificar permisos
    if (requestingUserId !== parseInt(id) && requestingUserRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este usuario'
      });
      return;
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
        return;
      }
    }

    // Verificar si el username ya está en uso por otro usuario
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        res.status(400).json({
          success: false,
          message: 'El username ya está en uso'
        });
        return;
      }
    }

    // Preparar datos a actualizar
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 12);
    }

    await user.update(updateData);

    // Responder sin password_hash
   const { password_hash, ...userResponse } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: userResponse
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    });
  }
};

/**
 * Eliminar usuario (soft delete)
 * DELETE /gameofbones/users/:id
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user?.id;
    const requestingUserRole = req.user?.role;

    // Verificar permisos
    if (requestingUserId !== parseInt(id) && requestingUserRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este usuario'
      });
      return;
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Soft delete (paranoid: true)
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
};

/**
 * Actualizar rol de usuario (BONUS)
 * PATCH /gameofbones/users/:id/role
 */
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar rol
    if (!role || !['admin', 'user'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "admin" o "user"'
      });
      return;
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    await user.update({ role });

    res.status(200).json({
      success: true,
      message: `Rol actualizado a ${role} exitosamente`,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rol'
    });
  }
};

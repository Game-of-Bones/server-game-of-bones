// src/services/userService.ts
import { userRepository } from '../repositories/userRepository';
import { UserResponse } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {

  /**
   * Obtener perfil de usuario por ID (sin contraseña)
   */
  async getUserById(id: number): Promise<UserResponse> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Retornar sin password_hash
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
  }

  /**
   * Obtener todos los usuarios (solo admins)
   */
  async getAllUsers(requesterId: number, limit = 50, offset = 0): Promise<UserResponse[]> {
    // Verificar que quien lo pide es admin
    const isAdmin = await userRepository.isAdmin(requesterId);

    if (!isAdmin) {
      throw new Error('No tienes permisos para ver todos los usuarios');
    }

    return await userRepository.findAll(limit, offset);
  }

  /**
   * Actualizar rol de usuario (solo admins)
   */
  async updateUserRole(
    adminId: number,
    targetUserId: number,
    newRole: 'admin' | 'user'
  ): Promise<void> {
    // Verificar que quien lo pide es admin
    const isAdmin = await userRepository.isAdmin(adminId);

    if (!isAdmin) {
      throw new Error('No tienes permisos para cambiar roles');
    }

    // No permitir que un admin se quite sus propios permisos
    if (adminId === targetUserId && newRole === 'user') {
      throw new Error('No puedes quitarte tus propios permisos de admin');
    }

    // Verificar que el usuario objetivo existe
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar rol
    const updated = await userRepository.updateRole(targetUserId, newRole);

    if (!updated) {
      throw new Error('Error al actualizar el rol');
    }
  }

  /**
   * Actualizar email del usuario
   */
  async updateEmail(userId: number, newEmail: string): Promise<void> {
    // Validar formato de email
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Email inválido');
    }

    // Verificar que el nuevo email no esté en uso
    const emailExists = await userRepository.emailExists(newEmail);
    if (emailExists) {
      const existingUser = await userRepository.findByEmail(newEmail);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El email ya está en uso');
      }
    }

    const updated = await userRepository.updateEmail(userId, newEmail);

    if (!updated) {
      throw new Error('Error al actualizar el email');
    }
  }

  /**
   * Actualizar username
   */
  async updateUsername(userId: number, newUsername: string): Promise<void> {
    // Validar username
    if (newUsername.length < 3) {
      throw new Error('El username debe tener al menos 3 caracteres');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      throw new Error('El username solo puede contener letras, números y guiones bajos');
    }

    // Verificar que no esté en uso
    const usernameExists = await userRepository.usernameExists(newUsername);
    if (usernameExists) {
      const existingUser = await userRepository.findByUsername(newUsername);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El username ya está en uso');
      }
    }

    const updated = await userRepository.updateUsername(userId, newUsername);

    if (!updated) {
      throw new Error('Error al actualizar el username');
    }
  }

  /**
   * Cambiar contraseña
   */
  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Obtener usuario con contraseña
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Validar nueva contraseña
    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(newPassword)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }

    if (!/[0-9]/.test(newPassword)) {
      throw new Error('La contraseña debe contener al menos un número');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar en BD
    const updated = await userRepository.updatePassword(userId, hashedPassword);

    if (!updated) {
      throw new Error('Error al actualizar la contraseña');
    }
  }

  /**
   * Eliminar usuario (soft delete)
   */
  async deleteUser(requesterId: number, targetUserId: number): Promise<void> {
    // Solo admins o el propio usuario pueden eliminar
    const isAdmin = await userRepository.isAdmin(requesterId);
    const isSelf = requesterId === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new Error('No tienes permisos para eliminar este usuario');
    }

    // No permitir que el último admin se elimine a sí mismo
    if (isAdmin && isSelf) {
      const admins = await userRepository.findByRole('admin');
      if (admins.length === 1) {
        throw new Error('No puedes eliminar la última cuenta de administrador');
      }
    }

    const deleted = await userRepository.softDelete(targetUserId);

    if (!deleted) {
      throw new Error('Error al eliminar el usuario');
    }
  }

  /**
   * Obtener estadísticas de usuarios (solo admins)
   */
  async getUserStats(requesterId: number) {
    const isAdmin = await userRepository.isAdmin(requesterId);

    if (!isAdmin) {
      throw new Error('No tienes permisos para ver estadísticas');
    }

    const totalUsers = await userRepository.count();
    const admins = await userRepository.findByRole('admin');
    const regularUsers = await userRepository.findByRole('user');

    return {
      total: totalUsers,
      admins: admins.length,
      regularUsers: regularUsers.length
    };
  }

  // ==================== UTILIDADES PRIVADAS ====================

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Exportar instancia singleton
export const userService = new UserService();

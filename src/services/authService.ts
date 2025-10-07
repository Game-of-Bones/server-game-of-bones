// services/authService.ts
import { userRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';

export class AuthService {
  async register(username: string, email: string, password: string) {
    // Validar si el email existe
    if (await userRepository.emailExists(email)) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword
    });

    return user;
  }
}

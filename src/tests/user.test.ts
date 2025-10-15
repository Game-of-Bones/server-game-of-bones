import { User, CreateUserDTO, LoginDTO, UserResponse, AuthResponse } from '../models/User';
import sequelize from '../database/database';

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  describe('User Interface', () => {
    test('Debe tener todas las propiedades requeridas', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@gameofbones.com',
        password_hash: '$2a$12$hashedpassword',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password_hash');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('updated_at');
      expect(user).toHaveProperty('deleted_at');
    });

    test('El role debe ser admin o user', () => {
      const adminUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@gameofbones.com',
        password_hash: 'hash',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      const regularUser: User = {
        id: 2,
        username: 'user',
        email: 'user@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      expect(['admin', 'user']).toContain(adminUser.role);
      expect(['admin', 'user']).toContain(regularUser.role);
    });

    test('deleted_at puede ser null', () => {
      const activeUser: User = {
        id: 1,
        username: 'active',
        email: 'active@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      const deletedUser: User = {
        id: 2,
        username: 'deleted',
        email: 'deleted@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
      };

      expect(activeUser.deleted_at).toBeNull();
      expect(deletedUser.deleted_at).toBeInstanceOf(Date);
    });
  });

  describe('CreateUserDTO', () => {
    test('Debe tener username, email y password', () => {
      const dto: CreateUserDTO = {
        username: 'newuser',
        email: 'new@gameofbones.com',
        password: 'SecurePass123!'
      };

      expect(dto).toHaveProperty('username');
      expect(dto).toHaveProperty('email');
      expect(dto).toHaveProperty('password');
    });

    test('El role debe ser opcional', () => {
      const dtoWithoutRole: CreateUserDTO = {
        username: 'user1',
        email: 'user1@gameofbones.com',
        password: 'pass123'
      };

      const dtoWithRole: CreateUserDTO = {
        username: 'user2',
        email: 'user2@gameofbones.com',
        password: 'pass123',
        role: 'admin'
      };

      expect(dtoWithoutRole.role).toBeUndefined();
      expect(dtoWithRole.role).toBe('admin');
    });
  });

  describe('LoginDTO', () => {
    test('Debe tener email y password', () => {
      const loginDto: LoginDTO = {
        email: 'user@gameofbones.com',
        password: 'SecurePass123!'
      };

      expect(loginDto).toHaveProperty('email');
      expect(loginDto).toHaveProperty('password');
    });
  });

  describe('UserResponse', () => {
    test('No debe contener password_hash', () => {
      const userResponse: UserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@gameofbones.com',
        role: 'user',
        created_at: new Date()
      };

      expect(userResponse).not.toHaveProperty('password_hash');
      expect(userResponse).toHaveProperty('id');
      expect(userResponse).toHaveProperty('username');
      expect(userResponse).toHaveProperty('email');
      expect(userResponse).toHaveProperty('role');
      expect(userResponse).toHaveProperty('created_at');
    });
  });

  describe('AuthResponse', () => {
    test('Debe contener user y token', () => {
      const authResponse: AuthResponse = {
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@gameofbones.com',
          role: 'user',
          created_at: new Date()
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      };

      expect(authResponse).toHaveProperty('user');
      expect(authResponse).toHaveProperty('token');
      expect(authResponse.user).not.toHaveProperty('password_hash');
      expect(typeof authResponse.token).toBe('string');
    });
  });

  describe('Type Safety', () => {
    test('TypeScript debe validar tipos correctamente', () => {
      // Este test pasa si el código compila sin errores de tipo
      const user: User = {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password_hash: 'hash',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      // TypeScript debería prevenir esto en tiempo de compilación:
      // const invalidUser: User = {
      //   id: 'not-a-number', // ❌ Error: Type 'string' is not assignable to type 'number'
      //   ...
      // };

      expect(typeof user.id).toBe('number');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
    });
  });
});

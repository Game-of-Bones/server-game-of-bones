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

  describe('User Model Structure', () => {
    test('Debe crear un usuario con todas las propiedades', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@gameofbones.com',
        password_hash: 'hashedpassword123',
        role: 'user',
        avatar_url: 'https://res.cloudinary.com/demo/avatar.jpg',
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@gameofbones.com');
      expect(user.role).toBe('user');
      expect(user.avatar_url).toBe('https://res.cloudinary.com/demo/avatar.jpg');
      expect(user.deletedAt).toBeUndefined();
    });

    test('El role debe ser admin o user', async () => {
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@gameofbones.com',
        password_hash: 'hash',
        role: 'admin',
      });

      const regularUser = await User.create({
        username: 'user',
        email: 'user@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
      });

      expect(['admin', 'user']).toContain(adminUser.role);
      expect(['admin', 'user']).toContain(regularUser.role);
    });

    test('avatar_url puede ser null o una URL válida', async () => {
      const userWithoutAvatar = await User.create({
        username: 'noavatar',
        email: 'noavatar@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
      });

      const userWithAvatar = await User.create({
        username: 'withavatar',
        email: 'withavatar@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
        avatar_url: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
      });

      // Sin avatar puede ser null o undefined
      expect([null, undefined]).toContain(userWithoutAvatar.avatar_url);
      expect(userWithAvatar.avatar_url).toBeTruthy();
      expect(typeof userWithAvatar.avatar_url).toBe('string');
    });

    test('deletedAt debe ser null para usuarios activos', async () => {
      const activeUser = await User.create({
        username: 'active',
        email: 'active@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
      });

      expect(activeUser.deletedAt).toBeUndefined();
    });
  });

  describe('CreateUserDTO', () => {
    test('Debe tener username, email y password', () => {
      const dto: CreateUserDTO = {
        username: 'newuser',
        email: 'new@gameofbones.com',
        password: 'SecurePass123!',
      };

      expect(dto).toHaveProperty('username');
      expect(dto).toHaveProperty('email');
      expect(dto).toHaveProperty('password');
    });

    test('El role debe ser opcional', () => {
      const dtoWithoutRole: CreateUserDTO = {
        username: 'user1',
        email: 'user1@gameofbones.com',
        password: 'pass123',
      };

      const dtoWithRole: CreateUserDTO = {
        username: 'user2',
        email: 'user2@gameofbones.com',
        password: 'pass123',
        role: 'admin',
      };

      expect(dtoWithoutRole.role).toBeUndefined();
      expect(dtoWithRole.role).toBe('admin');
    });

    test('El avatar_url debe ser opcional', () => {
      const dtoWithoutAvatar: CreateUserDTO = {
        username: 'user3',
        email: 'user3@gameofbones.com',
        password: 'pass123',
      };

      const dtoWithAvatar: CreateUserDTO = {
        username: 'user4',
        email: 'user4@gameofbones.com',
        password: 'pass123',
        avatar_url: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
      };

      expect(dtoWithoutAvatar.avatar_url).toBeUndefined();
      expect(dtoWithAvatar.avatar_url).toBeTruthy();
    });
  });

  describe('LoginDTO', () => {
    test('Debe tener email y password', () => {
      const loginDto: LoginDTO = {
        email: 'user@gameofbones.com',
        password: 'SecurePass123!',
      };

      expect(loginDto).toHaveProperty('email');
      expect(loginDto).toHaveProperty('password');
    });
  });

  describe('UserResponse', () => {
    test('toJSON debe eliminar password_hash y deleted_at', async () => {
      const user = await User.create({
        username: 'jsonuser',
        email: 'jsonuser@gameofbones.com',
        password_hash: 'hashedpassword',
        role: 'user',
        avatar_url: 'https://res.cloudinary.com/demo/avatar.jpg',
      });

      const userResponse = user.toJSON();
      const responseAsAny = userResponse as any; // Aserción para verificar campos eliminados

      // Verificar que NO existen estos campos
      expect(responseAsAny.password_hash).toBeUndefined();
      expect(responseAsAny.deleted_at).toBeUndefined();

      // Verificar que SÍ existen estos campos
      expect(userResponse).toHaveProperty('id');
      expect(userResponse).toHaveProperty('username');
      expect(userResponse).toHaveProperty('email');
      expect(userResponse).toHaveProperty('role');
    });

    test('avatar_url debe estar presente en la respuesta', async () => {
      const user = await User.create({
        username: 'avatarresponse',  // ✅ Cambié el username para evitar duplicados
        email: 'avatarresponse@gameofbones.com',
        password_hash: 'hashedpassword',
        role: 'user',
        avatar_url: 'https://res.cloudinary.com/demo/avatar2.jpg',
      });

      const userResponse = user.toJSON();

      expect(userResponse).toHaveProperty('avatar_url');
      expect(userResponse.avatar_url).toBe('https://res.cloudinary.com/demo/avatar2.jpg');
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
          avatar_url: null,
          created_at: new Date(),
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      expect(authResponse).toHaveProperty('user');
      expect(authResponse).toHaveProperty('token');
      expect(authResponse.user).not.toHaveProperty('password_hash');
      expect(typeof authResponse.token).toBe('string');
    });
  });

  describe('Password Hashing', () => {
    test('Debe hashear la contraseña al crear un usuario', async () => {
      const plainPassword = 'MySecurePassword123!';

      const user = await User.create({
        username: 'hashtest',
        email: 'hashtest@gameofbones.com',
        password_hash: plainPassword,
        role: 'user',
      });

      expect(user.password_hash).not.toBe(plainPassword);
      expect(user.password_hash).toMatch(/^\$2[aby]\$/); // Formato bcrypt
    });

    test('Debe verificar contraseñas correctamente', async () => {
      const plainPassword = 'TestPassword123!';

      const user = await User.create({
        username: 'comparetest',
        email: 'comparetest@gameofbones.com',
        password_hash: plainPassword,
        role: 'user',
      });

      const isValid = await user.comparePassword(plainPassword);
      const isInvalid = await user.comparePassword('WrongPassword');

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Validations', () => {
    test('Debe rechazar emails inválidos', async () => {
      await expect(
        User.create({
          username: 'invalidmail',
          email: 'notanemail',
          password_hash: 'hash',
          role: 'user',
        })
      ).rejects.toThrow();
    });

    test('Debe rechazar usernames duplicados', async () => {
      await User.create({
        username: 'duplicate',
        email: 'user1@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
      });

      await expect(
        User.create({
          username: 'duplicate',
          email: 'user2@gameofbones.com',
          password_hash: 'hash',
          role: 'user',
        })
      ).rejects.toThrow();
    });

    test('Debe rechazar emails duplicados', async () => {
      await User.create({
        username: 'user3',
        email: 'duplicate@gameofbones.com',
        password_hash: 'hash',
        role: 'user',
      });

      await expect(
        User.create({
          username: 'user4',
          email: 'duplicate@gameofbones.com',
          password_hash: 'hash',
          role: 'user',
        })
      ).rejects.toThrow();
    });
  });

  describe('Type Safety', () => {
    test('TypeScript debe validar tipos correctamente', async () => {
      const user = await User.create({
        username: 'typetest',
        email: 'type@test.com',
        password_hash: 'hash',
        role: 'user',
        avatar_url: 'https://res.cloudinary.com/demo/avatar.jpg',
      });

      expect(typeof user.id).toBe('number');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.avatar_url).toBe('string');
    });
  });
});

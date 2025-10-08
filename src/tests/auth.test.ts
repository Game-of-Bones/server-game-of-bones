
import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';

const testUser = {
  username: 'testuser',
  email: 'test@gameofbones.com',
  password: 'TestPass123!'
};

describe('Auth Endpoints', () => {
  
  beforeAll(async () => {
    // Sincronizar base de datos de test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Limpiar y cerrar conexión
    await User.destroy({ where: {}, force: true });
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpiar usuarios antes de cada test
    await User.destroy({ where: {}, force: true });
  });

  describe('POST /api/auth/register', () => {
    
    test('Debe registrar un nuevo usuario exitosamente', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    test('No debe registrar usuario con email duplicado', async () => {
      // Crear usuario primero
      await User.create({
        username: testUser.username,
        email: testUser.email,
        password_hash: 'hashedpassword',
        role: 'user'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El email ya está registrado');
    });

    test('No debe registrar usuario sin campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Todos los campos son requeridos');
    });

    test('No debe registrar usuario con email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'invalid-email',
          password: 'TestPass123!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email inválido');
    });

    test('No debe registrar usuario con contraseña corta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
          email: 'test3@gameofbones.com',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('La contraseña debe tener al menos 8 caracteres');
    });
  });

  describe('POST /api/auth/login', () => {
    
    beforeEach(async () => {
      // Crear usuario de prueba para login
      const hashedPassword = await require('bcrypt').hash(testUser.password, 12);
      await User.create({
        username: testUser.username,
        email: testUser.email,
        password_hash: hashedPassword,
        role: 'user'
      });
    });

    test('Debe hacer login exitosamente con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    test('No debe hacer login con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    test('No debe hacer login con email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@gameofbones.com',
          password: 'TestPass123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    test('No debe hacer login sin campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email y contraseña son requeridos');
    });
  });
});
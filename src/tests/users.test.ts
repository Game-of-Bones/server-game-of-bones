import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

describe('Users API Tests', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: number;
  let userId: number;

  // Configurar base de datos antes de todos los tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Crear usuario admin
    const adminUser = await User.create({
      username: 'admin_test',
      email: 'admin@test.com',
      password_hash: await bcrypt.hash('admin123', 12),
      role: 'admin'
    });
    adminId = adminUser.id;

    // Crear usuario normal
    const normalUser = await User.create({
      username: 'user_test',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('user123', 12),
      role: 'user'
    });
    userId = normalUser.id;

    // Obtener tokens
    const adminLogin = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminLogin.body.data.token;

    const userLogin = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'user@test.com', password: 'user123' });
    userToken = userLogin.body.data.token;
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /gameofbones/users', () => {
    it('debe devolver todos los usuarios si eres admin', async () => {
      const response = await request(app)
        .get('/gameofbones/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('debe denegar acceso si no eres admin', async () => {
      const response = await request(app)
        .get('/gameofbones/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('debe denegar acceso sin token', async () => {
      const response = await request(app)
        .get('/gameofbones/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /gameofbones/users/:id', () => {
    it('debe permitir a un usuario ver su propio perfil', async () => {
      const response = await request(app)
        .get(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.password_hash).toBeUndefined();
    });

    it('debe permitir a un admin ver cualquier perfil', async () => {
      const response = await request(app)
        .get(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('debe denegar a un usuario ver otro perfil', async () => {
      const response = await request(app)
        .get(`/gameofbones/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('debe devolver 404 si el usuario no existe', async () => {
      const response = await request(app)
        .get('/gameofbones/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /gameofbones/users/:id', () => {
    it('debe permitir actualizar username', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ username: 'new_username' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('new_username');
    });

    it('debe permitir actualizar email', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'newemail@test.com' });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('newemail@test.com');
    });

    it('debe permitir actualizar contraseña', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('debe rechazar username duplicado', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ username: 'admin_test' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('username');
    });

    it('debe rechazar email duplicado', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'admin@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email');
    });

    it('debe denegar actualizar otro usuario si no eres admin', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ username: 'hacked' });

      expect(response.status).toBe(403);
    });

    it('debe validar formato de email', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });

    it('debe validar longitud de password', async () => {
      const response = await request(app)
        .put(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ password: '123' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /gameofbones/users/:id', () => {
    it('debe permitir a un usuario eliminar su propia cuenta', async () => {
      // Crear usuario temporal para eliminar
      const tempUser = await User.create({
        username: 'temp_user',
        email: 'temp@test.com',
        password_hash: await bcrypt.hash('temp123', 12),
        role: 'user'
      });

      const loginRes = await request(app)
        .post('/gameofbones/auth/login')
        .send({ email: 'temp@test.com', password: 'temp123' });

      const response = await request(app)
        .delete(`/gameofbones/users/${tempUser.id}`)
        .set('Authorization', `Bearer ${loginRes.body.data.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar que fue soft-deleted
      const deletedUser = await User.findByPk(tempUser.id, { paranoid: false });
      expect(deletedUser?.deleted_at).not.toBeNull();
    });

    it('debe permitir a un admin eliminar cualquier usuario', async () => {
      const tempUser = await User.create({
        username: 'temp_user2',
        email: 'temp2@test.com',
        password_hash: await bcrypt.hash('temp123', 12),
        role: 'user'
      });

      const response = await request(app)
        .delete(`/gameofbones/users/${tempUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('debe denegar eliminar otro usuario si no eres admin', async () => {
      const response = await request(app)
        .delete(`/gameofbones/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /gameofbones/users/:id/role', () => {
    it('debe permitir a admin cambiar rol de usuario', async () => {
      const response = await request(app)
        .patch(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe('admin');
    });

    it('debe denegar cambiar rol si no eres admin', async () => {
      const response = await request(app)
        .patch(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: 'admin' });

      expect(response.status).toBe(403);
    });

    it('debe rechazar rol inválido', async () => {
      const response = await request(app)
        .patch(`/gameofbones/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'superadmin' });

      expect(response.status).toBe(400);
    });
  });
});

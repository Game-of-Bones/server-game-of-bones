// src/tests/likes.test.ts
import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';
import Like from '../models/Like'; // ✅ Import como default
import Fossil from '../models/GobModelPost';
import bcrypt from 'bcrypt';

describe('Likes API Tests', () => {
  let userToken: string;
  let user2Token: string;
  let testUser: User;
  let testUser2: User;
  let testPost: Fossil;

  beforeAll(async () => {
    // Sincronizar BD
    await sequelize.sync({ force: true });

    // Crear usuarios de prueba
    testUser = await User.create({
      username: 'liker1',
      email: 'liker1@test.com',
      password_hash: await bcrypt.hash('password123', 12),
      role: 'user'
    });

    testUser2 = await User.create({
      username: 'liker2',
      email: 'liker2@test.com',
      password_hash: await bcrypt.hash('password123', 12),
      role: 'user'
    });

    // Obtener tokens
    const user1Login = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'liker1@test.com', password: 'password123' });
    userToken = user1Login.body.data.token;

    const user2Login = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'liker2@test.com', password: 'password123' });
    user2Token = user2Login.body.data.token;

    // Crear post de prueba
    testPost = await Fossil.create({
      title: 'Post para Likes',
      summary: 'Este post se usará para probar likes',
      author_id: testUser.id,
      fossil_type: 'bones_teeth',
      status: 'published'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpiar likes antes de cada test
    await Like.destroy({ where: {}, force: true });
  });

  describe('GET /api/posts/:postId/likes', () => {
    it('debe devolver el conteo correcto de likes', async () => {
      // Crear algunos likes
      await Like.create({
        user_id: testUser.id,
        post_id: testPost.id
      });

      await Like.create({
        user_id: testUser2.id,
        post_id: testPost.id
      });

      const response = await request(app)
        .get(`/api/posts/${testPost.id}/likes`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
    });

    it('debe devolver 0 para post sin likes', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}/likes`);

      expect(response.status).toBe(200);
      expect(response.body.data.count).toBe(0);
    });

    it('debe devolver 404 para post inexistente', async () => {
      const response = await request(app)
        .get('/api/posts/99999/likes');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/posts/:postId/like (Toggle)', () => {
    it('debe permitir dar like si no lo ha dado antes', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.action).toBe('liked');

      // Verificar que el like existe
      const likeCount = await Like.count({
        where: {
          user_id: testUser.id,
          post_id: testPost.id
        }
      });
      expect(likeCount).toBe(1);
    });

    it('debe permitir quitar like si ya lo había dado', async () => {
      // Primero dar like
      await Like.create({
        user_id: testUser.id,
        post_id: testPost.id
      });

      // Luego quitarlo
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.action).toBe('unliked');

      // Verificar que el like ya no existe
      const likeCount = await Like.count({
        where: {
          user_id: testUser.id,
          post_id: testPost.id
        }
      });
      expect(likeCount).toBe(0);
    });

    it('debe rechazar like sin autenticación', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/like`);

      expect(response.status).toBe(401);
    });

    it('debe devolver 404 para post inexistente', async () => {
      const response = await request(app)
        .post('/api/posts/99999/like')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('debe permitir que diferentes usuarios den like al mismo post', async () => {
      // User 1 da like
      await request(app)
        .post(`/api/posts/${testPost.id}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      // User 2 da like
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(201);

      // Verificar que hay 2 likes
      const totalLikes = await Like.count({
        where: { post_id: testPost.id }
      });
      expect(totalLikes).toBe(2);
    });
  });

  describe('GET /api/posts/:postId/like/check', () => {
    it('debe indicar que el usuario ha dado like', async () => {
      // Crear like
      await Like.create({
        user_id: testUser.id,
        post_id: testPost.id
      });

      const response = await request(app)
        .get(`/api/posts/${testPost.id}/like/check`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.hasLiked).toBe(true);
    });

    it('debe indicar que el usuario NO ha dado like', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}/like/check`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.hasLiked).toBe(false);
    });

    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}/like/check`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:userId/likes', () => {
    beforeEach(async () => {
      // Crear otro post
      const post2 = await Fossil.create({
        title: 'Segundo Post',
        summary: 'Otro post',
        author_id: testUser.id,
        fossil_type: 'bones_teeth',
        status: 'published'
      });

      // Usuario da like a 2 posts
      await Like.create({
        user_id: testUser.id,
        post_id: testPost.id
      });

      await Like.create({
        user_id: testUser.id,
        post_id: post2.id
      });
    });

    it('debe obtener todos los likes de un usuario', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser.id}/likes`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBe(2);
    });

    it('debe incluir información del post', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser.id}/likes`);

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('post');
      expect(response.body.data[0].post).toHaveProperty('title');
    });

    it('debe devolver 404 para usuario inexistente', async () => {
      const response = await request(app)
        .get('/api/users/99999/likes');

      expect(response.status).toBe(404);
    });

    it('debe devolver array vacío si el usuario no tiene likes', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser2.id}/likes`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });
  });

  describe('Restricción UNIQUE (user_id, post_id)', () => {
    it('no debe permitir duplicar likes del mismo usuario al mismo post', async () => {
      // Crear el primer like directamente en la BD
      await Like.create({
        user_id: testUser.id,
        post_id: testPost.id
      });

      // Intentar crear otro like igual (debería fallar)
      await expect(
        Like.create({
          user_id: testUser.id,
          post_id: testPost.id
        })
      ).rejects.toThrow();
    });
  });
});

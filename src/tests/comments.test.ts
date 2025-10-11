// src/tests/comments.test.ts
import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import Fossil from '../models/Posts';
import bcrypt from 'bcrypt';

describe('Comments API Tests', () => {
  let userToken: string;
  let adminToken: string;
  let testUser: User;
  let testPost: Fossil;
  let testComment: Comment;

  beforeAll(async () => {
    // Sincronizar BD
    await sequelize.sync({ force: true });

    // Crear usuario de prueba
    testUser = await User.create({
      username: 'commenter',
      email: 'commenter@test.com',
      password_hash: await bcrypt.hash('password123', 12),
      role: 'user'
    });

    // Crear admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password_hash: await bcrypt.hash('admin123', 12),
      role: 'admin'
    });

    // Obtener tokens
    const userLogin = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'commenter@test.com', password: 'password123' });
    userToken = userLogin.body.data.token;

    const adminLogin = await request(app)
      .post('/gameofbones/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminLogin.body.data.token;

    // Crear post de prueba
    testPost = await Fossil.create({
      title: 'Test Fossil Post',
      summary: 'Este es un post de prueba para comentarios',
      author_id: testUser.id,
      fossil_type: 'bones_teeth',
      status: 'published'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpiar comentarios antes de cada test
    await Comment.destroy({ where: {}, force: true });
  });

  describe('POST /gameofbones/posts/:postId/comments', () => {
    it('debe crear un comentario exitosamente', async () => {
      const response = await request(app)
        .post(`/gameofbones/posts/${testPost.id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Este es un comentario de prueba'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.content).toBe('Este es un comentario de prueba');
      expect(response.body.data.user_id).toBe(testUser.id);
      expect(response.body.data.post_id).toBe(testPost.id);
    });

    it('debe rechazar comentario sin autenticación', async () => {
      const response = await request(app)
        .post(`/gameofbones/posts/${testPost.id}/comments`)
        .send({
          content: 'Comentario sin auth'
        });

      expect(response.status).toBe(401);
    });

    it('debe rechazar comentario vacío', async () => {
      const response = await request(app)
        .post(`/gameofbones/posts/${testPost.id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: ''
        });

      expect(response.status).toBe(400);
    });

    it('debe rechazar comentario en post inexistente', async () => {
      const response = await request(app)
        .post('/gameofbones/posts/99999/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Comentario en post inexistente'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /gameofbones/posts/:postId/comments', () => {
    beforeEach(async () => {
      // Crear varios comentarios para las pruebas
      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Primer comentario'
      });

      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Segundo comentario'
      });
    });

    it('debe obtener todos los comentarios de un post', async () => {
      const response = await request(app)
        .get(`/gameofbones/posts/${testPost.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBe(2);
    });

    it('debe incluir información del autor', async () => {
      const response = await request(app)
        .get(`/gameofbones/posts/${testPost.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('author');
      expect(response.body.data[0].author).toHaveProperty('username');
      expect(response.body.data[0].author.password_hash).toBeUndefined();
    });

    it('debe devolver array vacío si no hay comentarios', async () => {
      await Comment.destroy({ where: {}, force: true });

      const response = await request(app)
        .get(`/gameofbones/posts/${testPost.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBe(0);
    });

    it('debe devolver 404 para post inexistente', async () => {
      const response = await request(app)
        .get('/gameofbones/posts/99999/comments');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /gameofbones/comments/:id', () => {
    beforeEach(async () => {
      testComment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario específico'
      });
    });

    it('debe obtener un comentario por ID', async () => {
      const response = await request(app)
        .get(`/gameofbones/comments/${testComment.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testComment.id);
      expect(response.body.data.content).toBe('Comentario específico');
    });

    it('debe devolver 404 si el comentario no existe', async () => {
      const response = await request(app)
        .get('/gameofbones/comments/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /gameofbones/comments/:id', () => {
    beforeEach(async () => {
      testComment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Contenido original'
      });
    });

    it('debe actualizar un comentario propio', async () => {
      const response = await request(app)
        .put(`/gameofbones/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Contenido actualizado'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('Contenido actualizado');
    });

    it('debe rechazar actualización de comentario ajeno', async () => {
      const response = await request(app)
        .put(`/gameofbones/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${adminToken}`) // Admin intenta editar comentario de user
        .send({
          content: 'Intento de hackeo'
        });

      expect(response.status).toBe(403);
    });

    it('debe rechazar contenido vacío', async () => {
      const response = await request(app)
        .put(`/gameofbones/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: ''
        });

      expect(response.status).toBe(400);
    });

    it('debe devolver 404 si el comentario no existe', async () => {
      const response = await request(app)
        .put('/gameofbones/comments/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Contenido'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /gameofbones/comments/:id', () => {
    beforeEach(async () => {
      testComment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario a eliminar'
      });
    });

    it('debe permitir eliminar comentario propio (soft delete)', async () => {
      const response = await request(app)
        .delete(`/gameofbones/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar soft delete
      const deletedComment = await Comment.findByPk(testComment.id, { paranoid: false });
      expect(deletedComment).toBeTruthy();
      expect(deletedComment?.deleted_at).not.toBeNull();
    });

    it('debe permitir al admin eliminar cualquier comentario', async () => {
      const response = await request(app)
        .delete(`/gameofbones/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('debe devolver 404 si el comentario no existe', async () => {
      const response = await request(app)
        .delete('/gameofbones/comments/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('debe rechazar eliminación sin autenticación', async () => {
      const response = await request(app)
        .delete(`/gameofbones/comments/${testComment.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /gameofbones/users/:userId/comments', () => {
    beforeEach(async () => {
      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario 1 del usuario'
      });

      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario 2 del usuario'
      });
    });

    it('debe obtener todos los comentarios de un usuario', async () => {
      const response = await request(app)
        .get(`/gameofbones/users/${testUser.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBe(2);
    });

    it('debe devolver 404 si el usuario no existe', async () => {
      const response = await request(app)
        .get('/gameofbones/users/99999/comments');

      expect(response.status).toBe(404);
    });
  });
});

/**
 * COMMENTS ENDPOINTS TESTS
 *
 * Cubre:
 * - Crear comentario (auth)
 * - Validaciones y 401 sin token
 * - Listar comentarios de un post (público)
 * - Obtener comentario por id (público)
 * - Actualizar comentario (solo autor / auth)
 * - Eliminar comentario (soft delete / auth)
 */

import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';

describe('Comments API', () => {
  let authToken: string;
  let userId: number;
  let postId: number;

  beforeEach(async () => {
    // Estado limpio por test
    await Comment.destroy({ where: {}, force: true });
    await Post.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // 1) Usuario + token válido
    const reg = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'commenter',
        email: 'commenter@gameofbones.com',
        password: 'TestPass123!',
      })
      .expect(201);

    authToken = reg.body.data.token;
    userId = reg.body.data.user.id;

    // 2) Post publicado para comentar
    const post = await Post.create({
      title: 'Post para comentarios',
      summary:
        'Entrada publicada para probar la API de comentarios en los tests automáticos.',
      fossil_type: 'bones_teeth',
      user_id: userId,
      status: 'published',
    });
    postId = post.id;
  });

  describe('POST /api/posts/:postId/comments', () => {
    test('Debe crear un comentario con autenticación', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content:
            '¡Increíble hallazgo! Este fósil podría aportar mucha información.',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('post_id', postId);
      expect(res.body.data).toHaveProperty('user_id', userId);
      expect(res.body.data).toHaveProperty('author');
      expect(res.body.data.author).toHaveProperty('username', 'commenter');
    });

    test('Debe retornar 401 sin autenticación', async () => {
      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({ content: 'sin token' })
        .expect(401);
    });

    test('Debe validar campos requeridos (400 si falta content)', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app)
        .post('/api/posts/999999/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentario para post inexistente' });

      expect([404, 400]).toContain(res.status); // según cómo manejes la inexistencia
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    test('Debe listar comentarios de un post (público)', async () => {
      // Crear 2 comentarios
      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Primer comentario' })
        .expect(201);

      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Segundo comentario' })
        .expect(201);

      const res = await request(app)
        .get(`/api/posts/${postId}/comments`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('comments');
      expect(Array.isArray(res.body.data.comments)).toBe(true);
      expect(res.body.data.comments.length).toBe(2);

      const c = res.body.data.comments[0];
      expect(c).toHaveProperty('author');
      expect(c.author).toHaveProperty('username');
    });

    test('Debe devolver array vacío si no hay comentarios', async () => {
      const res = await request(app)
        .get(`/api/posts/${postId}/comments`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.comments)).toBe(true);
      expect(res.body.data.comments.length).toBe(0);
    });
  });

  describe('GET /api/comments/:id', () => {
    test('Debe obtener un comentario por ID (público)', async () => {
      const created = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentario específico' })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app).get(`/api/comments/${id}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', id);
      expect(res.body.data).toHaveProperty('post_id', postId);
      expect(res.body.data).toHaveProperty('author');
    });

    test('Debe retornar 404 si el comentario no existe', async () => {
      const res = await request(app).get('/api/comments/999999').expect(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/comments/:id', () => {
    test('Debe actualizar un comentario propio (auth)', async () => {
      const created = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Contenido original' })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app)
        .put(`/api/comments/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Contenido actualizado' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('content', 'Contenido actualizado');
    });

    test('Debe retornar 401 sin autenticación', async () => {
      const created = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'X' })
        .expect(201);

      await request(app)
        .put(`/api/comments/${created.body.data.id}`)
        .send({ content: 'no debería' })
        .expect(401);
    });

    test('Debe retornar 404 si el comentario no existe', async () => {
      const res = await request(app)
        .put('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'nada' });

      expect([404, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    test('Debe eliminar lógicamente un comentario (soft delete)', async () => {
      const created = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'A eliminar' })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app)
        .delete(`/api/comments/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verificación de soft delete en DB (paranoid: false)
      const deleted = await Comment.findOne({
        where: { id },
        paranoid: false,
      });

      expect(deleted).toBeTruthy();
      expect(deleted?.deletedAt).not.toBeNull(); // 👈 camelCase en TS
    });

    test('Debe retornar 401 sin autenticación', async () => {
      const created = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'No borrar sin token' })
        .expect(201);

      await request(app)
        .delete(`/api/comments/${created.body.data.id}`)
        .expect(401);
    });

    test('Debe retornar 404 si el comentario no existe', async () => {
      const res = await request(app)
        .delete('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });
});


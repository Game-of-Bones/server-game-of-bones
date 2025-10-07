import request from 'supertest';
import mysql from 'mysql2/promise';
import express, { Application } from 'express';
import { createCommentsRouter } from '../../routes/comments';

describe('Comments Integration Tests', () => {
  let app: Application;
  let pool: mysql.Pool;
  let authToken: string;
  let testUserId: bigint;
  let testPostId: bigint;
  let testCommentId: bigint;

  beforeAll(async () => {
    pool = mysql.createPool({
      host: process.env.DB_TEST_HOST || 'localhost',
      port: parseInt(process.env.DB_TEST_PORT || '3306'),
      database: process.env.DB_TEST_NAME || 'game_of_bones_app_test',
      user: process.env.DB_TEST_USER || 'root',
      password: process.env.DB_TEST_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    app = express();
    app.use(express.json());
    
    app.use((req, res, next) => {
      if (authToken && req.headers.authorization === `Bearer ${authToken}`) {
        (req as any).user = { id: Number(testUserId), role: 'user' };
      }
      next();
    });
    
    app.use('/api', createCommentsRouter(pool));

    const [userResult] = await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ('integrationuser', 'integration@test.com', 'hash', 'user')`
    );
    testUserId = BigInt((userResult as any).insertId);
    authToken = 'test-token-123';

    const [postResult] = await pool.query(
      `INSERT INTO posts (title, summary, discovery_date, location, paleontologist, 
                          fossil_type, geological_period, author_id, status) 
       VALUES ('Integration Test Post', 'Test Summary', '2024-01-01', 'Test Location',
               'Test Paleo', 'dinosaurio', 'Cretácico', ?, 'published')`,
      [testUserId.toString()]
    );
    testPostId = BigInt((postResult as any).insertId);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM comments WHERE user_id = ?', [testUserId.toString()]);
    await pool.query('DELETE FROM posts WHERE id = ?', [testPostId.toString()]);
    await pool.query('DELETE FROM users WHERE id = ?', [testUserId.toString()]);
    await pool.end();
  });

  afterEach(async () => {
    await pool.query('DELETE FROM comments WHERE post_id = ?', [testPostId.toString()]);
  });

  describe('POST /api/posts/:postId/comments', () => {
    it('debe crear un comentario correctamente', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Este es un comentario de prueba de integración'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.content).toBe('Este es un comentario de prueba de integración');
      expect(response.body.data.username).toBe('integrationuser');
      expect(response.body.message).toBe('Comentario creado exitosamente');

      testCommentId = BigInt(response.body.data.id);
    });

    it('debe retornar 401 sin autenticación', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .send({
          content: 'Comentario sin auth'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Usuario no autenticado');
    });

    it('debe retornar 404 con post inexistente', async () => {
      const response = await request(app)
        .post('/api/posts/999999/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Comentario en post inexistente'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Post no encontrado');
    });

    it('debe retornar 400 con contenido vacío', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('El contenido no puede estar vacío');
    });

    it('debe retornar 400 con contenido muy largo', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'a'.repeat(1001)
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('debe sanitizar el contenido HTML', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '<script>alert("xss")</script>Comentario seguro'
        })
        .expect(201);

      expect(response.body.data.content).not.toContain('<script>');
      expect(response.body.data.content).toContain('&lt;script&gt;');
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    beforeEach(async () => {
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario 1']
      );
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario 2']
      );
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario 3']
      );
    });

    it('debe obtener todos los comentarios de un post', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPostId}/comments`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toHaveLength(3);
      expect(response.body.data.pagination.total).toBe(3);
      expect(response.body.data.comments[0]).toHaveProperty('username');
    });

    it('debe respetar la paginación', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPostId}/comments?limit=2&offset=0`)
        .expect(200);

      expect(response.body.data.comments).toHaveLength(2);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.hasMore).toBe(true);
    });

    it('debe retornar 404 con post inexistente', async () => {
      const response = await request(app)
        .get('/api/posts/999999/comments')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/comments/:id', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?) ',
        [testPostId.toString(), testUserId.toString(), 'Comentario para obtener por ID']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe obtener un comentario por ID', async () => {
      const response = await request(app)
        .get(`/api/comments/${testCommentId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('Comentario para obtener por ID');
      expect(response.body.data.username).toBe('integrationuser');
    });

    it('debe retornar 404 con ID inexistente', async () => {
      const response = await request(app)
        .get('/api/comments/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/comments/:id', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Contenido original']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe actualizar un comentario', async () => {
      const response = await request(app)
        .put(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Contenido actualizado'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('Contenido actualizado');
      expect(response.body.message).toBe('Comentario actualizado exitosamente');
    });

    it('debe retornar 401 sin autenticación', async () => {
      await request(app)
        .put(`/api/comments/${testCommentId}`)
        .send({
          content: 'Intento sin auth'
        })
        .expect(401);
    });

    it('debe retornar 404 con comentario inexistente', async () => {
      const response = await request(app)
        .put('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Contenido nuevo'
        })
        .expect(404);

      expect(response.body.error).toBe('Comentario no encontrado');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario a eliminar']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe eliminar un comentario', async () => {
      const response = await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Comentario eliminado exitosamente');

      const checkResponse = await request(app)
        .get(`/api/comments/${testCommentId}`)
        .expect(404);
    });

    it('debe retornar 401 sin autenticación', async () => {
      await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .expect(401);
    });

    it('debe retornar 404 con comentario inexistente', async () => {
      await request(app)
        .delete('/api/comments/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Flujo completo', () => {
    it('debe crear, obtener, actualizar y eliminar un comentario', async () => {
      const createResponse = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentario de flujo completo' })
        .expect(201);

      const commentId = createResponse.body.data.id;

      const getResponse = await request(app)
        .get(`/api/comments/${commentId}`)
        .expect(200);

      expect(getResponse.body.data.content).toBe('Comentario de flujo completo');

      const updateResponse = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentario actualizado en flujo' })
        .expect(200);

      expect(updateResponse.body.data.content).toBe('Comentario actualizado en flujo');

      await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(app)
        .get(`/api/comments/${commentId}`)
        .expect(404);
    });
  });
});
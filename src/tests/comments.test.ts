/**
 * TESTS DE COMENTARIOS
 * 
 * NOTA: Estos tests no funcionarán hasta que User y Post estén implementados
 * Los dejamos preparados para cuando tus compañeras terminen sus modelos
 */

import request from 'supertest';
import app from '../app';
import Comment from '../models/Comment';

// Declarar tipos temporales para User y Post
type User = any;
type Post = any;

// Mock temporal de User y Post (comentar cuando existan los modelos reales)
const User = {
  create: jest.fn(),
  destroy: jest.fn(),
};

const Post = {
  create: jest.fn(),
  destroy: jest.fn(),
  findByPk: jest.fn(),
};

describe('Comments API', () => {
  let testUser: User;
  let testPost: Post;

  beforeEach(async () => {
    // NOTA: Estos tests no funcionarán hasta que User y Post existan
    // Descomenta estas líneas cuando estén disponibles:
    
    /*
    // Crear usuario de prueba
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
    });

    // Crear post de prueba
    testPost = await Post.create({
      user_id: testUser.id,
      title: 'Test Post',
      content: 'This is a test post content',
    });
    */
  });

  afterEach(async () => {
    // Limpiar datos después de cada test
    // Descomenta cuando User y Post existan:
    /*
    await Comment.destroy({ where: {}, truncate: true, cascade: true });
    await Post.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    */
  });

  // Tests comentados hasta que User y Post existan
  describe.skip('POST /api/comments', () => {
    it('debe crear un comentario exitosamente', async () => {
      const commentData = {
        post_id: testPost.id.toString(),
        user_id: testUser.id.toString(),
        content: 'Este es un comentario de prueba',
      };

      const response = await request(app)
        .post('/api/comments')
        .send(commentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(commentData.content);
    });

    it('debe crear una respuesta a un comentario', async () => {
      // Crear comentario padre
      const parentComment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario padre',
      });

      const replyData = {
        post_id: testPost.id.toString(),
        user_id: testUser.id.toString(),
        content: 'Esta es una respuesta',
        parent_id: parentComment.id.toString(),
      };

      const response = await request(app)
        .post('/api/comments')
        .send(replyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(replyData.content);
      expect(response.body.parent_id).toBeTruthy();
    });

    it('debe retornar 404 si el post no existe', async () => {
      const commentData = {
        post_id: '99999',
        user_id: testUser.id.toString(),
        content: 'Comentario para post inexistente',
      };

      await request(app)
        .post('/api/comments')
        .send(commentData)
        .expect(404);
    });
  });

  describe.skip('GET /api/posts/:post_id/comments', () => {
    it('debe obtener todos los comentarios de un post', async () => {
      // Crear varios comentarios
      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Primer comentario',
      });

      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Segundo comentario',
      });

      const response = await request(app)
        .get(`/api/posts/${testPost.id}/comments`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('debe incluir información del usuario en los comentarios', async () => {
      await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario con usuario',
      });

      const response = await request(app)
        .get(`/api/posts/${testPost.id}/comments`)
        .expect(200);

      expect(response.body[0]).toHaveProperty('user');
      expect(response.body[0].user).toHaveProperty('username');
    });

    it('debe retornar array vacío si no hay comentarios', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}/comments`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe.skip('GET /api/comments/:id', () => {
    it('debe obtener un comentario por ID', async () => {
      const comment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario específico',
      });

      const response = await request(app)
        .get(`/api/comments/${comment.id}`)
        .expect(200);

      expect(response.body.id).toBe(comment.id.toString());
      expect(response.body.content).toBe(comment.content);
    });

    it('debe retornar 404 si el comentario no existe', async () => {
      await request(app)
        .get('/api/comments/99999')
        .expect(404);
    });
  });

  describe.skip('PUT /api/comments/:id', () => {
    it('debe actualizar un comentario', async () => {
      const comment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Contenido original',
      });

      const updatedContent = 'Contenido actualizado';

      const response = await request(app)
        .put(`/api/comments/${comment.id}`)
        .send({ content: updatedContent })
        .expect(200);

      expect(response.body.content).toBe(updatedContent);
    });

    it('debe retornar 404 si el comentario no existe', async () => {
      await request(app)
        .put('/api/comments/99999')
        .send({ content: 'Nuevo contenido' })
        .expect(404);
    });
  });

  describe.skip('DELETE /api/comments/:id', () => {
    it('debe eliminar un comentario', async () => {
      const comment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario a eliminar',
      });

      await request(app)
        .delete(`/api/comments/${comment.id}`)
        .expect(200);

      // Verificar que fue eliminado
      const deletedComment = await Comment.findByPk(comment.id);
      expect(deletedComment).toBeNull();
    });

    it('debe retornar 404 si el comentario no existe', async () => {
      await request(app)
        .delete('/api/comments/99999')
        .expect(404);
    });

    it('debe eliminar respuestas en cascada al eliminar comentario padre', async () => {
      // Crear comentario padre
      const parentComment = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Comentario padre',
      });

      // Crear respuesta
      const reply = await Comment.create({
        post_id: testPost.id,
        user_id: testUser.id,
        content: 'Respuesta',
        parent_id: parentComment.id,
      });

      // Eliminar comentario padre
      await request(app)
        .delete(`/api/comments/${parentComment.id}`)
        .expect(200);

      // Verificar que la respuesta también fue eliminada
      const deletedReply = await Comment.findByPk(reply.id);
      expect(deletedReply).toBeNull();
    });
  });
});
/**
 * POSTS ENDPOINTS TESTS
 *
 * Cubre:
 * - Listar posts públicos + paginación + filtros
 * - Obtener post por id (con autor)
 * - Crear post (auth)
 * - Actualizar post (auth + 404)
 * - Eliminar post (soft delete, auth + 404)
 */

import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';
import { Post } from '../models/Post';

describe('Posts Endpoints', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // 🔄 Estado limpio y token fresco por test
  beforeEach(async () => {
    await Post.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'fossilhunter',
        email: 'hunter@gameofbones.com',
        password: 'TestPass123!',
      })
      .expect(201);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  describe('GET /api/posts', () => {
    test('Debe listar posts públicos con paginación', async () => {
      await Post.create({
        title: 'Descubrimiento de T-Rex',
        summary:
          'Un increíble T-Rex encontrado en Montana con características únicas.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'published',
      });

      await Post.create({
        title: 'Fósil de Trilobite',
        summary:
          'Trilobite del período Cámbrico preservado en roca sedimentaria.',
        fossil_type: 'shell_exoskeletons',
        user_id: userId,
        status: 'published',
      });

      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.posts).toHaveLength(2);
      expect(res.body.data.pagination).toMatchObject({ total: 2, page: 1 });
    });

    test('No debe mostrar posts en borrador a usuarios no autenticados', async () => {
      await Post.create({
        title: 'Post Borrador',
        summary:
          'Este post está en borrador y no debería ser visible públicamente.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'draft',
      });

      const res = await request(app).get('/api/posts').expect(200);
      expect(res.body.data.posts).toHaveLength(0);
    });

    test('Debe soportar filtros por fossil_type', async () => {
      await Post.create({
        title: 'Huesos de dinosaurio',
        summary:
          'Fósiles de huesos de dinosaurio encontrados en excavación reciente.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'published',
      });
      await Post.create({
        title: 'Concha marina',
        summary:
          'Fósil de concha marina del período jurásico muy bien conservada.',
        fossil_type: 'shell_exoskeletons',
        user_id: userId,
        status: 'published',
      });

      const res = await request(app)
        .get('/api/posts?fossil_type=bones_teeth')
        .expect(200);

      expect(res.body.data.posts).toHaveLength(1);
      expect(res.body.data.posts[0].fossil_type).toBe('bones_teeth');
    });
  });

  describe('GET /api/posts/:id', () => {
    test('Debe obtener un post por ID con información del autor', async () => {
      const post = await Post.create({
        title: 'Post de Prueba',
        summary:
          'Resumen del post de prueba con información sobre el descubrimiento.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'published',
      });

      const res = await request(app).get(`/api/posts/${post.id}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', post.id);
      expect(res.body.data).toHaveProperty('title', 'Post de Prueba');
      expect(res.body.data.author).toHaveProperty('username', 'fossilhunter');
      expect(res.body.data).toHaveProperty('likes_count', 0);
      expect(res.body.data).toHaveProperty('comments_count', 0);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app).get('/api/posts/99999').expect(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/posts', () => {
    test('Debe crear un post con autenticación', async () => {
      const newPost = {
        title: 'Nuevo Descubrimiento de Velociraptor',
        summary:
          'Fósiles preservados de un Velociraptor en el desierto de Gobi con rasgos únicos.',
        fossil_type: 'bones_teeth',
        location: 'Desierto de Gobi, Mongolia',
        geological_period: 'Cretácico',
        status: 'published',
      };

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPost)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Post creado exitosamente');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newPost.title);
      expect(res.body.data.user_id).toBe(userId);
    });

    test('No debe crear post sin autenticación', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Post sin auth',
          summary:
            'Este post no debería crearse sin autenticación del usuario.',
          fossil_type: 'bones_teeth',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('No debe crear post sin campos requeridos', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Solo título' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/posts/:id', () => {
    test('Debe actualizar un post propio', async () => {
      const post = await Post.create({
        title: 'Post Original',
        summary:
          'Este es el resumen original del post que será actualizado en las pruebas.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'draft',
      });

      const updates = { title: 'Post Actualizado', status: 'published' };

      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Post Actualizado');
      expect(res.body.data.status).toBe('published');
    });

    test('No debe actualizar post sin autenticación', async () => {
      const post = await Post.create({
        title: 'Post Original',
        summary:
          'Este es el resumen original del post que será actualizado en las pruebas.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'draft',
      });

      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .send({ title: 'Intento sin auth' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app)
        .put('/api/posts/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Actualización' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    test('Debe eliminar un post propio (soft delete)', async () => {
      const post = await Post.create({
        title: 'Post a Eliminar',
        summary:
          'Este post será eliminado mediante soft delete para pruebas.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'published',
      });

      const res = await request(app)
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Post eliminado exitosamente');

      // Verificar soft delete (deletedAt no nulo)
      const deletedPost = await Post.findOne({
        where: { id: post.id },
        paranoid: false,
      });

      expect(deletedPost).toBeTruthy();
      expect(deletedPost?.deletedAt).not.toBeNull();
    });

    test('No debe eliminar post sin autenticación', async () => {
      const post = await Post.create({
        title: 'Post a Eliminar',
        summary:
          'Este post será eliminado mediante soft delete para pruebas.',
        fossil_type: 'bones_teeth',
        user_id: userId,
        status: 'published',
      });

      const res = await request(app)
        .delete(`/api/posts/${post.id}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app)
        .delete('/api/posts/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});

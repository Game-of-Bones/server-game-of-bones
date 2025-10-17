/**
 * POSTS ENDPOINTS TESTS
 *
 * Cubre:
 * - Crear post (auth)
 * - Validaciones y 401 sin token
 * - Listar posts (público)
 * - Obtener post por id (público)
 * - Actualizar post (solo autor / auth)
 * - Eliminar post (soft delete / auth)
 */

import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { Post } from '../models/Post';

describe('Posts API', () => {
  let authToken: string;
  let userId: number;
  let postId: number;

  beforeEach(async () => {
    // Estado limpio por test
    await Post.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // 1) Usuario + token válido
    const reg = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'fossilhunter',
        email: 'hunter@gameofbones.com',
        password: 'TestPass123!',
      })
      .expect(201);

    authToken = reg.body.data.token;
    userId = reg.body.data.user.id;
  });

  describe('POST /api/posts', () => {
    test('Debe crear un post con autenticación', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Descubrimiento de Spinosaurus en Marruecos',
          summary: 'Fósil de dinosaurio acuático encontrado en el Sahara con características únicas.',
          post_content: 'Un equipo de paleontólogos ha descubierto restos fósiles de Spinosaurus aegyptiacus en las formaciones Kem Kem de Marruecos. Este hallazgo incluye vértebras caudales que sugieren adaptaciones acuáticas nunca antes vistas en terópodos. El análisis de los huesos revela una densidad ósea similar a la de los pingüinos actuales.',
          fossil_type: 'bones_teeth',
          status: 'published',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('summary');
      expect(res.body.data).toHaveProperty('post_content');
      expect(res.body.data.post_content).toContain('paleontólogos');
      expect(res.body.data).toHaveProperty('user_id', userId);
    });

    test('Debe retornar 401 sin autenticación', async () => {
      await request(app)
        .post('/api/posts')
        .send({
          title: 'Post sin token',
          summary: 'Este post no debería crearse por falta de autenticación válida',
          post_content: 'Este post no debería crearse porque no hay token de autenticación.',
          fossil_type: 'bones_teeth',
        })
        .expect(401);
    });

    test('Debe validar campos requeridos (400 si falta title)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          summary: 'Solo resumen, sin título pero con contenido suficiente',
          post_content: 'Contenido sin título del post que debería fallar la validación',
          fossil_type: 'bones_teeth',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('Debe validar campos requeridos (400 si falta summary)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Título sin resumen',
          post_content: 'Contenido sin resumen del post que debería fallar la validación',
          fossil_type: 'bones_teeth',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('Debe validar campos requeridos (400 si falta post_content)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Título sin contenido',
          summary: 'Resumen sin contenido pero con caracteres suficientes',
          fossil_type: 'bones_teeth',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('Debe validar tipo de fósil', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post con tipo inválido',
          summary: 'Resumen con tipo de fósil inválido que debe fallar',
          post_content: 'Contenido del post con tipo de fósil inválido que debería rechazarse',
          fossil_type: 'tipo_invalido',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/posts', () => {
    test('Debe listar todos los posts publicados (público)', async () => {
      // Crear 2 posts publicados
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post 1',
          summary: 'Resumen descriptivo del primer post con suficiente extensión',
          post_content: 'Contenido detallado del primer post sobre un descubrimiento increíble que cumple con todos los requisitos.',
          fossil_type: 'bones_teeth',
          status: 'published',
        })
        .expect(201);

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post 2',
          summary: 'Resumen descriptivo del segundo post con extensión adecuada',
          post_content: 'Contenido detallado del segundo post sobre otro hallazgo fascinante en el campo paleontológico.',
          fossil_type: 'shell_exoskeletons',
          status: 'published',
        })
        .expect(201);

      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('posts');
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBe(2);

      const post = res.body.data.posts[0];
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('summary');
      expect(post).toHaveProperty('post_content');
      expect(post).toHaveProperty('author');
      expect(post.author).toHaveProperty('username');
    });

    test('Debe devolver array vacío si no hay posts', async () => {
      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBe(0);
    });

    test('No debe mostrar posts en draft por defecto', async () => {
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post Draft',
          summary: 'Este post en borrador no debería aparecer en listado público',
          post_content: 'Este es un borrador y no debería aparecer en la lista pública de posts publicados.',
          fossil_type: 'bones_teeth',
          status: 'draft',
        })
        .expect(201);

      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.data.posts.length).toBe(0);
    });
  });

  describe('GET /api/posts/:id', () => {
    test('Debe obtener un post por ID (público)', async () => {
      const created = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post específico',
          summary: 'Resumen para obtener por ID con extensión suficiente',
          post_content: 'Este es el contenido completo de un post que será recuperado por su ID único en el sistema.',
          fossil_type: 'plant_impressions',
          status: 'published',
        })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app).get(`/api/posts/${id}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', id);
      expect(res.body.data).toHaveProperty('title', 'Post específico');
      expect(res.body.data).toHaveProperty('post_content');
      expect(res.body.data.post_content).toContain('contenido completo');
      expect(res.body.data).toHaveProperty('author');
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app).get('/api/posts/999999').expect(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/posts/:id', () => {
    test('Debe actualizar un post propio (auth)', async () => {
      const created = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post original',
          summary: 'Resumen original con extensión mínima requerida para validación',
          post_content: 'Contenido original que será actualizado posteriormente con nueva información.',
          fossil_type: 'bones_teeth',
          status: 'draft',
        })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app)
        .put(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post actualizado',
          summary: 'Resumen actualizado con nueva información y extensión adecuada',
          post_content: 'Contenido completamente actualizado con nueva información científica relevante para la comunidad.',
          status: 'published',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Post actualizado');
      expect(res.body.data).toHaveProperty('post_content');
      expect(res.body.data.post_content).toContain('completamente actualizado');
      expect(res.body.data).toHaveProperty('status', 'published');
    });

    test('Debe retornar 401 sin autenticación', async () => {
      const created = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post para update',
          summary: 'Resumen para test de actualización sin autenticación válida',
          post_content: 'Contenido que no se podrá actualizar sin token de autenticación válido.',
          fossil_type: 'bones_teeth',
        })
        .expect(201);

      await request(app)
        .put(`/api/posts/${created.body.data.id}`)
        .send({ title: 'No debería actualizar' })
        .expect(401);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app)
        .put('/api/posts/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'nada' });

      expect([404, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    test('Debe eliminar lógicamente un post (soft delete)', async () => {
      const created = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post a eliminar',
          summary: 'Este post será eliminado mediante proceso de soft delete',
          post_content: 'Este contenido será eliminado mediante soft delete preservando integridad de datos.',
          fossil_type: 'tracks_traces',
          status: 'published',
        })
        .expect(201);

      const id = created.body.data.id;

      const res = await request(app)
        .delete(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verificación de soft delete en DB (paranoid: false)
      const deleted = await Post.findOne({
        where: { id },
        paranoid: false,
      });

      expect(deleted).toBeTruthy();
      expect(deleted?.deletedAt).not.toBeNull();
    });

    test('Debe retornar 401 sin autenticación', async () => {
      const created = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'No borrar sin token',
          summary: 'Post que no puede eliminarse sin autenticación válida del usuario',
          post_content: 'Este post no debería poder eliminarse sin autenticación válida en el sistema.',
          fossil_type: 'bones_teeth',
        })
        .expect(201);

      await request(app)
        .delete(`/api/posts/${created.body.data.id}`)
        .expect(401);
    });

    test('Debe retornar 404 si el post no existe', async () => {
      const res = await request(app)
        .delete('/api/posts/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });
});

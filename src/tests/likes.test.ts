/**
 * LIKES ENDPOINTS TESTS
 */

import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Like } from '../models/Like';

describe('Likes API - Toggle Style (POST /api/posts/:id/like)', () => {
  let authToken: string;
  let postId: number;

  beforeEach(async () => {
    await Like.destroy({ where: {}, force: true });
    await Post.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    const reg = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'liker',
        email: 'liker@gameofbones.com',
        password: 'TestPass123!',
      })
      .expect(201);

    authToken = reg.body.data.token;

    // ✅ Post con post_content añadido
    const post = await Post.create({
      title: 'Fósil increíble',
      summary: 'Descubrimiento de fósil en excelente estado.',
      post_content: 'Este descubrimiento paleontológico representa un hallazgo extraordinario. Los restos fósiles encontrados están en un estado de conservación excepcional, lo que permitirá realizar estudios detallados sobre la anatomía y comportamiento de esta especie extinta.',
      fossil_type: 'bones_teeth',
      user_id: reg.body.data.user.id,
      status: 'published',
    });
    postId = post.id;
  });

  test('Debe dar like y devolver liked: true (201)', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('liked', true);
    expect(res.body.data).toHaveProperty('postId', postId);
  });

  test('Debe quitar el like si ya estaba (liked: false)', async () => {
    // Dar like primero
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    // Quitar like
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('liked', false);
  });

  test('Debe retornar 401 sin autenticación', async () => {
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .expect(401);
  });

  test('Debe retornar 404 si el post no existe', async () => {
    const res = await request(app)
      .post('/api/posts/999999/like')
      .set('Authorization', `Bearer ${authToken}`);

    expect([404, 400]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});

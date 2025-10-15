import request from 'supertest';
import app from '../app';
import sequelize from '../database/database';
import { User } from '../models/User';
import { Post } from '../models/Post';

describe('Likes API - Toggle Style (POST /api/posts/:id/like)', () => {
  let authToken: string;
  let postId: number;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
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

    const post = await Post.create({
      title: 'Fósil increíble',
      summary: 'Descubrimiento de fósil en excelente estado.',
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
    expect(res.body.liked).toBe(true);
    expect(typeof res.body.likes_count).toBe('number');
  });

  test('Debe quitar el like si ya estaba (liked: false)', async () => {
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.liked).toBe(false);
  });

  test('Debe retornar 401 sin autenticación', async () => {
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .expect(401);
  });

  test('Debe retornar 404 si el post no existe', async () => {
    await request(app)
      .post(`/api/posts/99999/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});

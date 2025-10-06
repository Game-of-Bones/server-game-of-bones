import mysql from 'mysql2/promise';
import { CommentsRepository } from '../../database/repositories/commentsRepository';
import { CreateCommentDTO } from '../../models/Comment';

describe('CommentsRepository', () => {
  let pool: mysql.Pool;
  let repository: CommentsRepository;
  let testUserId: bigint;
  let testPostId: bigint;
  let testCommentId: bigint;

  beforeAll(async () => {
    // Usar pool con variables de entorno
    pool = mysql.createPool({
      host: process.env.DB_TEST_HOST,
      port: parseInt(process.env.DB_TEST_PORT!),
      user: process.env.DB_TEST_USER,
      password: process.env.DB_TEST_PASSWORD,
      database: process.env.DB_TEST_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    repository = new CommentsRepository(pool);

    // Crear usuario y post de prueba
    const [userResult] = await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ('testuser', 'test@example.com', 'hash', 'user')`
    );
    testUserId = BigInt((userResult as any).insertId);

    const [postResult] = await pool.query(
      `INSERT INTO posts (title, summary, discovery_date, location, paleontologist, 
                          fossil_type, geological_period, author_id, status) 
       VALUES ('Test Post', 'Test Summary', '2024-01-01', 'Test Location', 
               'Test Paleo', 'dinosaurio', 'Cretácico', ?, 'published')`,
      [testUserId.toString()]
    );
    testPostId = BigInt((postResult as any).insertId);
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await pool.query('DELETE FROM comments WHERE user_id = ?', [testUserId.toString()]);
    await pool.query('DELETE FROM posts WHERE id = ?', [testPostId.toString()]);
    await pool.query('DELETE FROM users WHERE id = ?', [testUserId.toString()]);
    await pool.end();
  });

  afterEach(async () => {
    if (testCommentId) {
      await pool.query('DELETE FROM comments WHERE id = ?', [testCommentId.toString()]);
      testCommentId = 0n;
    }
  });

  describe('create', () => {
    it('debe crear un comentario correctamente', async () => {
      const commentData: CreateCommentDTO = {
        post_id: testPostId,
        user_id: testUserId,
        content: 'Este es un comentario de prueba'
      };

      const comment = await repository.create(commentData);

      expect(comment).toBeDefined();
      expect(comment.id).toBeDefined();
      expect(comment.post_id).toBe(testPostId);
      expect(comment.user_id).toBe(testUserId);
      expect(comment.content).toBe(commentData.content);
      expect(comment.created_at).toBeInstanceOf(Date);

      testCommentId = comment.id;
    });

    it('debe fallar al crear un comentario con post_id inválido', async () => {
      const commentData: CreateCommentDTO = {
        post_id: 999999n,
        user_id: testUserId,
        content: 'Comentario con post inválido'
      };

      await expect(repository.create(commentData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario para buscar']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe encontrar un comentario por ID', async () => {
      const comment = await repository.findById(testCommentId);

      expect(comment).toBeDefined();
      expect(comment?.id).toBe(testCommentId);
      expect(comment?.content).toBe('Comentario para buscar');
    });

    it('debe retornar null si el comentario no existe', async () => {
      const comment = await repository.findById(999999n);
      expect(comment).toBeNull();
    });
  });

  describe('findByIdWithUser', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario con usuario']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe encontrar un comentario con información del usuario', async () => {
      const comment = await repository.findByIdWithUser(testCommentId);

      expect(comment).toBeDefined();
      expect(comment?.id).toBe(testCommentId);
      expect(comment?.username).toBe('testuser');
      expect(comment?.user_email).toBe('test@example.com');
    });
  });

  describe('findByPostId', () => {
    beforeEach(async () => {
      // Crear múltiples comentarios
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

    afterEach(async () => {
      await pool.query('DELETE FROM comments WHERE post_id = ?', [testPostId.toString()]);
    });

    it('debe obtener todos los comentarios de un post', async () => {
      const comments = await repository.findByPostId(testPostId);

      expect(comments).toHaveLength(3);
      expect(comments[0].username).toBe('testuser');
    });

    it('debe respetar el límite de paginación', async () => {
      const comments = await repository.findByPostId(testPostId, 2, 0);
      expect(comments).toHaveLength(2);
    });

    it('debe respetar el offset de paginación', async () => {
      const comments = await repository.findByPostId(testPostId, 10, 2);
      expect(comments).toHaveLength(1);
    });
  });

  describe('countByPostId', () => {
    beforeEach(async () => {
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario para contar']
      );
    });

    afterEach(async () => {
      await pool.query('DELETE FROM comments WHERE post_id = ?', [testPostId.toString()]);
    });

    it('debe contar correctamente los comentarios de un post', async () => {
      const count = await repository.countByPostId(testPostId);
      expect(count).toBe(1);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Contenido original']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe actualizar el contenido de un comentario', async () => {
      const newContent = 'Contenido actualizado';
      const updated = await repository.update(testCommentId, newContent);

      expect(updated).toBeDefined();
      expect(updated?.content).toBe(newContent);
    });

    it('debe retornar null si el comentario no existe', async () => {
      const updated = await repository.update(999999n, 'Nuevo contenido');
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario a eliminar']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe eliminar un comentario correctamente', async () => {
      const deleted = await repository.delete(testCommentId);
      expect(deleted).toBe(true);

      const comment = await repository.findById(testCommentId);
      expect(comment).toBeNull();
    });

    it('debe retornar false si el comentario no existe', async () => {
      const deleted = await repository.delete(999999n);
      expect(deleted).toBe(false);
    });
  });

  describe('isAuthor', () => {
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [testPostId.toString(), testUserId.toString(), 'Comentario de autor']
      );
      testCommentId = BigInt((result as any).insertId);
    });

    it('debe retornar true si el usuario es el autor', async () => {
      const isAuthor = await repository.isAuthor(testCommentId, testUserId);
      expect(isAuthor).toBe(true);
    });

    it('debe retornar false si el usuario no es el autor', async () => {
      const isAuthor = await repository.isAuthor(testCommentId, 999999n);
      expect(isAuthor).toBe(false);
    });
  });

  describe('postExists', () => {
    it('debe retornar true si el post existe', async () => {
      const exists = await repository.postExists(testPostId);
      expect(exists).toBe(true);
    });

    it('debe retornar false si el post no existe', async () => {
      const exists = await repository.postExists(999999n);
      expect(exists).toBe(false);
    });
  });
});
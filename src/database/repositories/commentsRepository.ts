import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Comment, CommentWithUser, CreateCommentDTO } from '../../models/Comment';

export class CommentsRepository {
  constructor(private pool: Pool) {}

  // Crear un nuevo comentario
  async create(data: CreateCommentDTO): Promise<Comment> {
    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    const values = [data.post_id, data.user_id, data.content];

    const [result] = await this.pool.query<ResultSetHeader>(query, values);

    const [rows] = await this.pool.query<Comment[] & RowDataPacket[]>(
      'SELECT * FROM comments WHERE id = ?',
      [result.insertId]
    );

    return rows[0];
  }

  // Obtener comentario por ID
  async findById(id: bigint): Promise<Comment | null> {
    const query = 'SELECT * FROM comments WHERE id = ?';
    const [rows] = await this.pool.query<Comment[] & RowDataPacket[]>(query, [id]);

    return rows[0] || null;
  }

  // Obtener comentario con información del usuario
  async findByIdWithUser(id: bigint): Promise<CommentWithUser | null> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email AS user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const [rows] = await this.pool.query<CommentWithUser[] & RowDataPacket[]>(query, [id]);
    return rows[0] || null;
  }

  // Obtener todos los comentarios de un post
  async findByPostId(postId: bigint, limit = 50, offset = 0): Promise<CommentWithUser[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email AS user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<CommentWithUser[] & RowDataPacket[]>(
      query,
      [postId, limit, offset]
    );
    return rows;
  }

  // Contar comentarios de un post
  async countByPostId(postId: bigint): Promise<number> {
    const query = 'SELECT COUNT(*) AS count FROM comments WHERE post_id = ?';
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [postId]);
    return Number(rows[0].count);
  }

  // Obtener comentarios de un usuario
  async findByUserId(userId: bigint, limit = 50, offset = 0): Promise<CommentWithUser[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email AS user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<CommentWithUser[] & RowDataPacket[]>(
      query,
      [userId, limit, offset]
    );
    return rows;
  }

  // Actualizar contenido de un comentario
  async update(id: bigint, content: string): Promise<Comment | null> {
    const updateQuery = 'UPDATE comments SET content = ? WHERE id = ?';
    await this.pool.query(updateQuery, [content, id]);

    const [rows] = await this.pool.query<Comment[] & RowDataPacket[]>(
      'SELECT * FROM comments WHERE id = ?',
      [id]
    );

    return rows[0] || null;
  }

  // Eliminar un comentario
  async delete(id: bigint): Promise<boolean> {
    const query = 'DELETE FROM comments WHERE id = ?';
    const [result] = await this.pool.query<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  // Verificar si un usuario es el autor del comentario
  async isAuthor(commentId: bigint, userId: bigint): Promise<boolean> {
    const query = 'SELECT id FROM comments WHERE id = ? AND user_id = ?';
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [commentId, userId]);
    return rows.length > 0;
  }

  // Verificar si existe un post
  async postExists(postId: bigint): Promise<boolean> {
    const query = 'SELECT id FROM posts WHERE id = ?';
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [postId]);
    return rows.length > 0;
  }
}

import { Pool, QueryResult } from 'pg';
import { Comment, CommentWithUser, CreateCommentDTO } from '../../models/Comment';

export class CommentsRepository {
  constructor(private pool: Pool) {}

  // Crear un nuevo comentario
  async create(data: CreateCommentDTO): Promise<Comment> {
    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [data.post_id, data.user_id, data.content];
    const result: QueryResult<Comment> = await this.pool.query(query, values);
    
    return result.rows[0];
  }

  // Obtener comentario por ID
  async findById(id: bigint): Promise<Comment | null> {
    const query = 'SELECT * FROM comments WHERE id = $1';
    const result: QueryResult<Comment> = await this.pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  // Obtener comentario con información del usuario
  async findByIdWithUser(id: bigint): Promise<CommentWithUser | null> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email as user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    
    const result: QueryResult<CommentWithUser> = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Obtener todos los comentarios de un post
  async findByPostId(postId: bigint, limit = 50, offset = 0): Promise<CommentWithUser[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email as user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result: QueryResult<CommentWithUser> = await this.pool.query(
      query, 
      [postId, limit, offset]
    );
    
    return result.rows;
  }

  // Contar comentarios de un post
  async countByPostId(postId: bigint): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM comments WHERE post_id = $1';
    const result = await this.pool.query(query, [postId]);
    
    return parseInt(result.rows[0].count, 10);
  }

  // Obtener comentarios de un usuario
  async findByUserId(userId: bigint, limit = 50, offset = 0): Promise<CommentWithUser[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        u.email as user_email
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result: QueryResult<CommentWithUser> = await this.pool.query(
      query,
      [userId, limit, offset]
    );
    
    return result.rows;
  }

  // Actualizar contenido de un comentario
  async update(id: bigint, content: string): Promise<Comment | null> {
    const query = `
      UPDATE comments 
      SET content = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result: QueryResult<Comment> = await this.pool.query(query, [content, id]);
    return result.rows[0] || null;
  }

  // Eliminar un comentario
  async delete(id: bigint): Promise<boolean> {
    const query = 'DELETE FROM comments WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Verificar si un usuario es el autor del comentario
  async isAuthor(commentId: bigint, userId: bigint): Promise<boolean> {
    const query = 'SELECT id FROM comments WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [commentId, userId]);
    
    return result.rows.length > 0;
  }

  // Verificar si existe un post
  async postExists(postId: bigint): Promise<boolean> {
    const query = 'SELECT id FROM posts WHERE id = $1';
    const result = await this.pool.query(query, [postId]);
    
    return result.rows.length > 0;
  }
}
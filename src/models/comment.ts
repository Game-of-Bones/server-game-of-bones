/**
 * MODELO DE COMENTARIOS
 * 
 * Este archivo define únicamente las INTERFACES y TIPOS de datos
 * para los comentarios 
 */

/**
 * Interfaz principal del comentario
 * Representa un comentario en un post 
 */
export interface Comment {
    id: bigint;                    // ID único del comentario
    post_id: bigint;               // ID del post (descubrimiento de fósil)
    user_id: bigint;               // ID del usuario que comentó
    content: string;               // Contenido del comentario (max 1000 caracteres)
    created_at: Date;              // Fecha y hora de creación
  }
  
  /**
   * Interfaz extendida que incluye información del usuario
   * Se usa cuando necesitamos mostrar quién escribió el comentario
   * Útil para renderizar en el frontend sin hacer queries adicionales
   */
  export interface CommentWithUser extends Comment {
    username: string;              // Nombre de usuario del autor
    user_email: string;            // Email del autor (para avatar o contacto)
  }
  
  /**
   * DTO (Data Transfer Object) para CREAR comentarios
   * Define exactamente qué datos se necesitan del cliente
   * para crear un nuevo comentario
   */
  export interface CreateCommentDTO {
    post_id: bigint;               // En qué descubrimiento se comenta
    user_id: bigint;               // Quién comenta (viene del token JWT)
    content: string;               // El texto del comentario
  }
  
  /**
   * DTO para ACTUALIZAR comentarios
   * Solo se permite modificar el contenido del comentario
   * No se puede cambiar el post ni el autor
   */
  export interface UpdateCommentDTO {
    content: string;               // Nuevo contenido del comentario
  }
  
  /**
   * Tipo para respuestas exitosas de la API
   */
  export interface CommentResponse {
    success: boolean;
    data: CommentWithUser;
    message?: string;
  }
  
  /**
   * Tipo para respuestas con múltiples comentarios
   */
  export interface CommentsListResponse {
    success: boolean;
    data: {
      comments: CommentWithUser[];
      pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    };
  }
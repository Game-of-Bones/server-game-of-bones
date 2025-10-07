-- ============================================
-- TABLA: COMMENTS
-- ============================================
-- Gestiona los comentarios de usuarios en posts
--
-- CARACTERÍSTICAS:
-- - Relación con posts y users mediante foreign keys
-- - Eliminación en cascada si se borra el post o usuario
-- - Soft delete: los comentarios no se borran físicamente
-- - Timestamps automáticos para auditoría
-- - Índices optimizados para consultas frecuentes
--
-- SOFT DELETE:
-- - deleted_at NULL: comentario activo
-- - deleted_at con fecha: comentario eliminado (recuperable)
--
-- ÍNDICES:
-- - post_id: búsqueda de comentarios por post
-- - user_id: búsqueda de comentarios por usuario
-- - created_at: ordenación temporal
-- - deleted_at: filtrado de eliminados
-- ============================================
USE game_of_bones_app;

-- Eliminar tabla si existe para recrearla con la estructura correcta
DROP TABLE IF EXISTS comments;

CREATE TABLE IF NOT EXISTS comments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del comentario',
  post_id BIGINT NOT NULL COMMENT 'ID del post al que pertenece el comentario',
  user_id BIGINT NOT NULL COMMENT 'ID del usuario que hizo el comentario',
  content TEXT NOT NULL COMMENT 'Contenido del comentario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del comentario',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última actualización',
  deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha y hora de eliminación lógica (soft delete)',
  
  -- Foreign keys
  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  -- Índices para mejorar el rendimiento
  INDEX idx_comments_post_id (post_id),
  INDEX idx_comments_user_id (user_id),
  INDEX idx_comments_created_at (created_at DESC),
  INDEX idx_comments_post_created (post_id, created_at DESC),
  INDEX idx_comments_deleted_at (deleted_at)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Comentarios de usuarios en posts';
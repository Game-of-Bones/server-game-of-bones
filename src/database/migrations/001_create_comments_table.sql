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
  INDEX idx_comments_post_created (post_id, created_at DESC)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Comentarios de usuarios en posts';
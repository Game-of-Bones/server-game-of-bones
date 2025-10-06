USE game_of_bones_app;

CREATE TABLE IF NOT EXISTS comments (
  id BIGINT PRIMARY KEY COMMENT 'Identificador único del comentario',
  post_id BIGINT NOT NULL COMMENT 'ID del post al que pertenece el comentario',
  user_id BIGINT NOT NULL COMMENT 'ID del usuario que hizo el comentario',
  content VARCHAR(1000) NOT NULL COMMENT 'Contenido del comentario (máximo 1000 caracteres)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del comentario',
  
  -- Foreign keys
  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) COMMENT='Comentarios de usuarios en posts';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Índice compuesto para queries comunes (obtener comentarios de un post ordenados por fecha)
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at DESC);

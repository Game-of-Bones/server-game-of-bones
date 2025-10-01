-- ========================================
-- Game of Bones Database Reference
-- ========================================

-- Step 1: Create databases
CREATE DATABASE game_of_bones_app;
CREATE DATABASE game_of_bones_app_test;

-- Step 2: Use database
USE game_of_bones_app;
USE game_of_bones_app_test;

-- Step 3: Example queries
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM comments;
SELECT * FROM likes;


-- Step 4: Tables definition

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Posts table
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    image_url VARCHAR(500),
    discovery_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    paleontologist VARCHAR(255) NOT NULL,
    fossil_type ENUM('dinosaurio', 'mamifero', 'reptil', 'ave', 'pez', 'invertebrado', 'planta', 'otro') NOT NULL,
    geological_period VARCHAR(100) NOT NULL,
    author_id BIGINT NOT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    source VARCHAR(500),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_discovery_date (discovery_date),
    INDEX idx_fossil_type (fossil_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Comments table
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Likes table
CREATE TABLE likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, post_id),
    INDEX idx_post (post_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Verify all tables were created successfully
SHOW TABLES;

-- ADD admin user (password: Admin123!)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@gameofbones.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIRSk6Nzv2', 'admin');

-- ADD regular user (password: User123!)
INSERT INTO users (username, email, password_hash, role) VALUES 
('usuario1', 'user@gameofbones.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIRSk6Nzv2', 'user');

-- ADD example post
INSERT INTO posts (title, summary, discovery_date, location, paleontologist, fossil_type, geological_period, author_id, status) VALUES 
('Nuevo Tyrannosaurus Rex descubierto en Montana', 
 'Un equipo de paleontólogos ha descubierto restos casi completos de un T-Rex en Montana, Estados Unidos.', 
 '2024-09-15', 
 'Montana, USA', 
 'Dr. Jane Smith', 
 'dinosaurio', 
 'Cretácico Superior', 
 1, 
 'published');
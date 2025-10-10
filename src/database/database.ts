// src/database/database.ts
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';

// Importar modelos explícitamente
import { User } from '../models/User';
import Fossil from '../models/GobModelPost';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const config = {
  database: isTest
    ? (process.env.DB_TEST_NAME || 'game_of_bones_app_test')
    : (process.env.DB_NAME || 'game_of_bones_app'),
  username: isTest
    ? (process.env.DB_TEST_USER || process.env.DB_USER || 'root')
    : (process.env.DB_USER || 'root'),
  password: isTest
    ? (process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '')
    : (process.env.DB_PASSWORD || ''),
  host: isTest
    ? (process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost')
    : (process.env.DB_HOST || 'localhost'),
  port: isTest
    ? parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306')
    : parseInt(process.env.DB_PORT || '3306'),
};

// ============================================
// INSTANCIA DE SEQUELIZE
// ============================================

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  
  // ✅ Cargar modelos explícitamente (NO usar models: [path])
  models: [User, Fossil, Comment, Like],
  
  pool: {
    max: isTest ? 5 : 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  timezone: '+00:00',
  
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
});

// ============================================
// FUNCIÓN DE TEST DE CONEXIÓN
// ============================================

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a: ${config.database}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};

// ============================================
// FUNCIÓN DE SINCRONIZACIÓN
// ============================================

export const syncDatabase = async (options?: { force?: boolean; alter?: boolean }): Promise<void> => {
  try {
    console.log('\n🔄 Sincronizando base de datos...');
    
    const syncOptions = {
      force: options?.force || false,
      alter: options?.alter || false
    };

    await sequelize.sync(syncOptions);
    
    if (syncOptions.force) {
      console.log('✅ Base de datos recreada (force: true)');
    } else if (syncOptions.alter) {
      console.log('✅ Base de datos actualizada (alter: true)');
    } else {
      console.log('✅ Base de datos sincronizada');
    }
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    throw error;
  }
};

export default sequelize;
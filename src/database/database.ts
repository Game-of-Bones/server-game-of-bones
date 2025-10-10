import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';

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

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  port: config.port,
  dialect: 'mysql',

  // 👇 Cargar SOLO los archivos de modelos, no el index.ts
  models: [
    path.join(__dirname, '../models/User.ts'),
    path.join(__dirname, '../models/GobModelPost.ts'),
    path.join(__dirname, '../models/Comment.ts'),
    path.join(__dirname, '../models/Like.ts'),
  ],

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
    freezeTableName: true
  }
});

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a: ${config.database}`);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};

export default sequelize;

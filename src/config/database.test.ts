import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Test database pool
const testPool = mysql.createPool({
  host: process.env.DB_TEST_HOST || 'localhost',
  port: parseInt(process.env.DB_TEST_PORT || '3306'),
  user: process.env.DB_TEST_USER || 'root',
  password: process.env.DB_TEST_PASSWORD || '',
  database: process.env.DB_TEST_NAME || 'game_of_bones_app_test',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

export const testConnection = async (): Promise<void> => {
  try {
    const connection = await testPool.getConnection();
    console.log('✅ Test database connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to test database:', error);
    throw error;
  }
};

export default testPool;
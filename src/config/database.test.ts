import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Test database pool
// Create a connection pool for the test database
const testPool = mysql.createPool({
  host: process.env.DB_TEST_HOST || 'localhost',
  port: parseInt(process.env.DB_TEST_PORT || '3306'),
  user: process.env.DB_TEST_USER || 'root',
  password: process.env.DB_TEST_PASSWORD || '',
  database: process.env.DB_TEST_NAME || 'game_of_bones_app_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Function to test the test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await testPool.getConnection();
    console.log('✅ MySQL test connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to MySQL test database:', error);
    throw error;
  }
};

// Export the pool to use in test files
export default testPool;
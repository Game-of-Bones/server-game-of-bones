import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool to the database
const client = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
client
  .getConnection()
  .then((connection) => {
    console.info(`Database connection successful on port ${process.env.DB_PORT} ✅`);
    connection.release();
  })
  .catch((error) => {
    console.warn("Warning: DB connection failed ❌");
    console.error(error);
  });

// Export the pool
export default client;


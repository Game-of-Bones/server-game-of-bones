import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Game of Bones API 🦴' });
});

// Function to start the server
const startServer = async () => {
  try {
    // Test database connection before starting server
    await testConnection();
    
    // If DB connection successful, start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1); // Exit if database connection fails
  }
};

// Execute the start function
startServer();

export default app;
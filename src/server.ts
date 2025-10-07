// src/server.ts
import app from './app';
import { testConnection } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1);
  }
};

startServer();

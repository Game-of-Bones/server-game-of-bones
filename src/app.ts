// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Game of Bones API 🦴' });
});

// API Routes
app.use('/api/auth', authRoutes);

export default app;

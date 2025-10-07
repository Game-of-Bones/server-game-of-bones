import express from 'express';
import dotenv from 'dotenv';
import pool, { testConnection } from './config/database';
// Importamos el router de comentarios
import { createCommentsRouter } from '../src/routes/comments';
import likesRoutes from '../src/routes/likes';
// import authRouter from './routes/auth.routes'; // Para el futuro

// Load environment variables
dotenv.config();

const app = express();
// Nota: La variable PORT es 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// usamos el pool importado directamente
app.use('/gameofbones', createCommentsRouter(pool));
app.use(likesRoutes);
// Si tuvieras el router de auth (de tu compañera) se montaría así:
// app.use('/gameofbones/auth', authRouter); 


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
      console.log(`🚀 Server running on http://localhost:${PORT} (API Base: http://localhost:${PORT}/gameofbones)`);
    });
  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1); // Exit if database connection fails
  }
};

// Execute the start function
startServer();

export default app;
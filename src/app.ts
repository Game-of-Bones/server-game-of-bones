import express from 'express';
import dotenv from 'dotenv';
<<<<<<< HEAD
import pool, { testConnection } from './config/database';
// Importamos el router de comentarios
import { createCommentsRouter } from '../src/routes/comments';
import likesRoutes from '../src/routes/likes';
// import authRouter from './routes/auth.routes'; // Para el futuro

=======
import { testConnection } from './config/database';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
>>>>>>> 403299b0eff80405ab06c85f01073d16b379e6fb
// Load environment variables
dotenv.config();

const app = express();
// Nota: La variable PORT es 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get('/gameofbones', (req, res) => {
  res.json({ message: 'Game of Bones API 🦴' });
});

// usamos el pool importado directamente
app.use('/gameofbones', createCommentsRouter(pool));
app.use('/gameofbones', likesRoutes);
// Si tuvieras el router de auth (de tu compañera) se montaría así:
// app.use('/gameofbones/auth', authRouter); 




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
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Execute the start function
startServer();

export default app;

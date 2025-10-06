import express from 'express';
import dotenv from 'dotenv';
import router from './router';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the main router
app.use(router);

export default app;
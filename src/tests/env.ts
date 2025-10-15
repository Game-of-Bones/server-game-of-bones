// src/tests/env.ts
import dotenv from 'dotenv';
import 'reflect-metadata';

// Carga SIEMPRE el .env.test para la suite
dotenv.config({ path: '.env.test' });

// Valores mínimos por si faltan
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initTestDB() {
  // Ruta de tu archivo schema.test.sql
  const schemaPath = path.join(__dirname, 'schema.test.sql');

  // Leer el contenido del archivo SQL
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Crear conexión con la base de datos de test
  const connection = await mysql.createConnection({
    host: process.env.DB_TEST_HOST || 'localhost',
    user: process.env.DB_TEST_USER || 'root',
    password: process.env.DB_TEST_PASSWORD || '',
    database: process.env.DB_TEST_NAME || 'game_of_bones_app_test',
    multipleStatements: true, // permite ejecutar todo el schema de golpe
  });

  try {
    // Ejecutar todas las instrucciones del schema.test.sql
    await connection.query(schema);
    console.log('Base de datos de test inicializada correctamente ✅');
  } catch (err) {
    console.error('Error al inicializar la base de datos de test:', err);
    console.error('❌ Error al inicializar la base de datos de test:', err);
    process.exit(1); // Salir con código de error si falla
  } finally {
    await connection.end();
  }
}

// Ejecutar la función
initTestDB();

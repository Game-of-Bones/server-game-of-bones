import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function initTestDB() {
  // Ruta de tu archivo schema.test.sql
  const schemaPath = path.join(__dirname, 'schema.test.sql');

  // Leer el contenido del archivo SQL
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Crear conexión con la base de datos de test
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',        // cambia por tu usuario
    password: 'tu_pass', // cambia por tu contraseña
    database: 'game_of_bones_app_test',
    multipleStatements: true, // permite ejecutar todo el schema de golpe
  });

  try {
    // Ejecutar todas las instrucciones del schema.test.sql
    await connection.query(schema);
    console.log('Base de datos de test inicializada correctamente ✅');
  } catch (err) {
    console.error('Error al inicializar la base de datos de test:', err);
  } finally {
    await connection.end();
  }
}

// Ejecutar la función
initTestDB();

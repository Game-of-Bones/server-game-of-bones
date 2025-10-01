import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function initDB() {
  // Ruta de tu archivo schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');

  // Leer el contenido del archivo SQL
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Crear conexión con la base de datos
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',        // cambia por tu usuario
    password: 'tu_pass', // cambia por tu contraseña
    database: 'game_of_bones_app',
    multipleStatements: true, // permite ejecutar todo el schema de golpe
  });

  try {
    // Ejecutar todas las instrucciones del schema.sql
    await connection.query(schema);
    console.log('Base de datos inicializada correctamente ✅');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  } finally {
    await connection.end();
  }
}

// Ejecutar la función
initDB();

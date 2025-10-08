import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

// Cargar variables de entorno
config();

const initTestDatabase = async () => {
  const rootConnection = new Sequelize({
    host: process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '3306'),
    username: process.env.DB_TEST_USER || process.env.DB_USER || 'root',
    password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    logging: false,
  });

  try {
    console.log('🔧 Conectando al servidor MySQL...');
    await rootConnection.authenticate();
    console.log('✅ Conectado al servidor MySQL');

    // 🔥 Usar la variable correcta del .env
    const dbName = process.env.DB_TEST_NAME || 'game_of_bones_app_test';

    // Eliminar base de datos si existe
    console.log(`🗑️  Eliminando base de datos ${dbName} si existe...`);
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    console.log('✅ Base de datos eliminada (si existía)');

    // Crear nueva base de datos
    console.log(`📦 Creando base de datos ${dbName}...`);
    await rootConnection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log('✅ Base de datos de test creada exitosamente');

    // Cerrar conexión
    await rootConnection.close();
    console.log('✅ Conexión cerrada');

    console.log('\n🎉 Base de datos de test inicializada correctamente');
    console.log(`📍 Nombre de la base de datos: ${dbName}`);
    console.log('\nAhora puedes ejecutar:');
    console.log('  npm run test        - Para ejecutar los tests');
    console.log('  npm run seed        - Para poblar con datos de prueba\n');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos de test:', error);
    throw error;
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  initTestDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initTestDatabase;
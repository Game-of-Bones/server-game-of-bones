import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

// Cargar variables de entorno
config();

// Forzar NODE_ENV a test para este script
process.env.NODE_ENV = 'test';

const initTestDatabase = async () => {
  // Conexión root para crear/eliminar la base de datos
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

    // Obtener nombre de la BD de test
    const dbName = process.env.DB_TEST_NAME || 'game_of_bones_app_test';

    // Eliminar base de datos si existe
    console.log(`🗑️  Eliminando base de datos ${dbName} si existe...`);
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    console.log('✅ Base de datos eliminada (si existía)');

    // Crear nueva base de datos
    console.log(`📦 Creando base de datos ${dbName}...`);
    await rootConnection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log('✅ Base de datos de test creada exitosamente');

    // Cerrar conexión root
    await rootConnection.close();

    // ============================================
    // Conectar a la BD de test y crear tablas
    // ============================================
    console.log('\n📊 Sincronizando modelos...');
    
    // Importar sequelize configurado (ya detectará NODE_ENV=test)
    const sequelize = (await import('./database')).default;
    
    // Importar todos los modelos para registrarlos
    await import('../models');

    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas exitosamente');

    // ============================================
    // Ejecutar seeders (opcional)
    // ============================================
    console.log('\n🌱 Ejecutando seeders...');
    try {
      const { default: runAllSeeders } = await import('../server/script/runAllSeeders');
      await runAllSeeders();
      console.log('✅ Seeders ejecutados correctamente');
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log('ℹ️  No se encontraron seeders (opcional)');
      } else {
        console.warn('⚠️  Error ejecutando seeders:', error.message);
      }
    }

    // Cerrar conexión
    await sequelize.close();
    console.log('✅ Conexión cerrada');

    console.log('\n🎉 Base de datos de test inicializada correctamente');
    console.log(`📍 Nombre de la base de datos: ${dbName}`);
    console.log('\n💡 Próximos pasos:');
    console.log('  1. npm run dev      - Levantar API en modo desarrollo');
    console.log('  2. Usar Postman     - Probar endpoints manualmente');
    console.log('  3. npm test         - Ejecutar tests automáticos\n');

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
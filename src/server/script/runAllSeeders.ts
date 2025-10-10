// src/server/script/runAllSeeders.ts
/**
 * EJECUTAR TODOS LOS SEEDERS
 * Script para poblar la base de datos con datos de prueba
 * Ejecutar: npm run seed
 */

import dotenv from 'dotenv';
import sequelize from '../../database/database';
import { setupAssociations } from '../../models';
import { seedUsers } from '../../database/seeders/01-users';
// import { seedFossils } from '../../database/seeders/02-fossils'; // Descomentar cuando exista
import { seedComments } from '../../database/seeders/03-comments';

dotenv.config();

const runAllSeeders = async (): Promise<void> => {
  try {
    console.log('\n🌱 ========================================');
    console.log('🦴 GAME OF BONES - SEEDERS');
    console.log('========================================\n');

    // 1. Conectar a la base de datos
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    // 2. Configurar asociaciones
    console.log('🔗 Configurando relaciones entre modelos...');
    setupAssociations();
    console.log('✅ Relaciones configuradas\n');

    // 3. Sincronizar modelos (⚠️ alter: true para no perder datos)
    console.log('🔄 Sincronizando modelos con la base de datos...');
    await sequelize.sync({ alter: true }); // Usar alter en lugar de force
    console.log('✅ Modelos sincronizados\n');

    // 4. Ejecutar seeders en orden
    console.log('📦 Ejecutando seeders...\n');

    // ORDEN IMPORTANTE:
    // 1. Users (no depende de nadie)
    await seedUsers();
    console.log('');

    // 2. Fossils/Posts (depende de Users)
    // await seedFossils(); // Descomentar cuando tu compañera lo cree
    // console.log('');

    // 3. Comments (depende de Users y Posts)
    // await seedComments(); // Comentar hasta que Posts exista
    // console.log('');

    console.log('========================================');
    console.log('🎉 SEEDERS COMPLETADOS EXITOSAMENTE!');
    console.log('========================================\n');

    console.log('📝 Credenciales de prueba:');
    console.log('   👑 Admin: admin@gameofbones.com / admin123');
    console.log('   👤 User:  maria@example.com / password123\n');

    console.log('💡 Próximos pasos:');
    console.log('   1. npm run dev     - Iniciar servidor');
    console.log('   2. Usar Postman    - Probar endpoints');
    console.log('   3. npm test        - Ejecutar tests\n');

    // Cerrar conexión
    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('ERROR AL EJECUTAR SEEDERS');
    console.error('========================================');
    console.error(error);
    console.error('========================================\n');

    await sequelize.close();
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllSeeders();
}

export default runAllSeeders;

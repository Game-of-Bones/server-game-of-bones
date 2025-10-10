// src/server/script/runAllSeeders.ts
/**
 * EJECUTAR TODOS LOS SEEDERS
 * Script para poblar la base de datos con datos de prueba
 * Ejecutar: npm run seed
 */

import 'reflect-metadata';
import dotenv from 'dotenv';

// ✅ CRÍTICO: Importar sequelize PRIMERO
import sequelize from '../../database/database';

// ✅ IMPORTANTE: Importar TODOS los modelos para que se registren
import { User } from '../../models/User';
import Fossil from '../../models/GobModelPost';
import { Comment } from '../../models/Comment';
import { Like } from '../../models/Like';

// ✅ Luego importar los seeders
import { seedUsers } from '../../database/seeders/01-users';
import { seedFossils } from '../../database/seeders/02-fossils';
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

    // 2. Los modelos ya están cargados automáticamente
    console.log('🔗 Modelos cargados automáticamente vía decoradores\n');

    // 3. Sincronizar modelos (⚠️ alter: true para no perder datos)
    console.log('🔄 Sincronizando modelos con la base de datos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados\n');

    // 4. Ejecutar seeders en orden
    console.log('📦 Ejecutando seeders...\n');

    // ORDEN IMPORTANTE:
    // 1. Users (no depende de nadie)
    console.log('   📝 1/3: Usuarios...');
    await seedUsers();
    console.log('');

    // 2. Fossils/Posts (depende de Users)
    console.log('   🦴 2/3: Fósiles...');
    await seedFossils();
    console.log('');

    // 3. Comments (depende de Users y Posts)
    console.log('   💬 3/3: Comentarios...');
    await seedComments();
    console.log('');

    console.log('========================================');
    console.log('🎉 SEEDERS COMPLETADOS EXITOSAMENTE!');
    console.log('========================================\n');

    console.log('🔐 Credenciales de prueba:');
    console.log('   👑 Admin: admin@gameofbones.com / admin123');
    console.log('   👤 User:  maria@example.com / password123\n');

    console.log('📚 Datos creados:');
    try {
      const userCount = await sequelize.models.User.count();
      const fossilCount = await sequelize.models.Fossil.count();
      const commentCount = await sequelize.models.Comment.count();
      console.log(`   👥 Usuarios: ${userCount}`);
      console.log(`   🦴 Fósiles: ${fossilCount}`);
      console.log(`   💬 Comentarios: ${commentCount}\n`);
    } catch (e) {
      console.log('   (No se pudo contar los registros)\n');
    }

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

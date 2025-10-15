// src/tests/setup.ts
import sequelize from '../database/database';

beforeAll(async () => {
  await sequelize.authenticate();
  // eslint-disable-next-line no-console
  console.log(`✅ Conectado a la BD de test: ${process.env.DB_TEST_NAME}`);
  await sequelize.sync({ force: true });
  console.log('✅ Tablas recreadas para tests');
});

afterAll(async () => {
  await sequelize.close();
  console.log('✅ Conexión cerrada tras tests');
});

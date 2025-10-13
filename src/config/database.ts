// Configuración de conexión a MySQL/PostgreSQL
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  // ...
});

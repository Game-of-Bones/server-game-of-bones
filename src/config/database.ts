/**
 * CONFIGURACIÓN DE SEQUELIZE
 * 
 * Configura la conexión a la base de datos MySQL
 * usando variables de entorno
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'game_of_bones_app',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  
  // Configuración de pool de conexiones
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  
  // Logging (desactiva en producción)
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Timezone
  timezone: '+00:00',
  
  // Define opciones por defecto para todos los modelos
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

export const testConnection = async (): Promise<boolean> => {
  try {
      await sequelize.authenticate();
      return true;
  } catch (error) {
      return false;
  }
};

export default sequelize;
// O export { sequelize, testConnection };
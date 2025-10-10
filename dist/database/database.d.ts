/**
 * CONFIGURACIÓN DE SEQUELIZE
 *
 * Configura la conexión a la base de datos MySQL
 * usando variables de entorno
 */
import { Sequelize } from 'sequelize';
declare const sequelize: Sequelize;
export declare const testConnection: () => Promise<boolean>;
export default sequelize;
//# sourceMappingURL=database.d.ts.map
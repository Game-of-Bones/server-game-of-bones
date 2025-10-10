/**
 * MODELS INDEX - Configuración y relaciones
 */
import sequelize from '../database/database';
import { Comment } from './Comment';
import { User } from './User';
import Fossil from './GobModelPost';
import { Like } from './Like';
/**
 * Configura las asociaciones (relaciones) entre los modelos de Sequelize.
 * Se llama desde server.ts después de autenticar la conexión a DB.
 */
export declare const setupAssociations: () => void;
export declare const syncDatabase: (force?: boolean) => Promise<void>;
export { sequelize, User, Fossil, // También lo puedes llamar Post si prefieres
Comment, Like };
export declare const Post: typeof Fossil;
export default sequelize;
//# sourceMappingURL=index.d.ts.map
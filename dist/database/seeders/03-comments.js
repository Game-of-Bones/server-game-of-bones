"use strict";
// /**
//  * SEEDER DE COMENTARIOS
//  */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearComments = exports.seedComments = void 0;
// import { Comment } from '../../models/Comment';
// import { User } from '../../models/User';
// // TODO: Descomentar cuando Post esté disponible
// // import { Post } from '../../models/Post';
// export const seedComments = async (): Promise<void> => {
//   try {
//     console.log('📝 Seeding comments...');
//     // Verificar que existen usuarios
//     const users = await User.findAll();
//     if (!users || users.length === 0) {
//       console.log('⚠️  No hay usuarios en la base de datos.');
//       console.log('💡 Crea algunos usuarios manualmente o espera el seeder de usuarios.');
//       console.log('ℹ️  Saltando seeder de comentarios...');
//       return;
//     }
//     // TODO: Cuando Post esté disponible, descomentar esta verificación
//     /*
//     const posts = await Post.findAll();
//     if (!posts || posts.length === 0) {
//       console.log('⚠️  No hay posts en la base de datos.');
//       console.log('💡 Crea algunos posts manualmente o espera el seeder de posts.');
//       console.log('ℹ️  Saltando seeder de comentarios...');
//       return;
//     }
//     */
//     // Datos de ejemplo de comentarios
//     // NOTA: Usar post_id = 1 asumiendo que existe (cambiar según tu BD)
//     const commentsData = [
//       {
//         content: '¡Increíble descubrimiento! Me encanta la paleontología. Siempre he sido un apasionado de los dinosaurios.',
//         user_id: users[0].id,
//         post_id: 1, // TODO: Cambiar por posts[0].id cuando Post esté disponible
//       },
//       {
//         content: 'Muy interesante, gracias por compartir esta información tan detallada.',
//         user_id: users[1]?.id || users[0].id,
//         post_id: 1,
//       },
//       {
//         content: 'Wow, no sabía esto sobre los dinosaurios del Cretácico. Fascinante.',
//         user_id: users[0].id,
//         post_id: 2, // TODO: Cambiar por posts[1].id cuando Post esté disponible
//       },
//       {
//         content: 'Excelente artículo. ¿Tienes más información sobre este tema?',
//         user_id: users[1]?.id || users[0].id,
//         post_id: 2,
//       },
//       {
//         content: '¿En qué museo se exhibe este fósil? Me gustaría verlo en persona.',
//         user_id: users[0].id,
//         post_id: 1,
//       },
//     ];
//     // Crear comentarios
//     const createdComments = await Comment.bulkCreate(commentsData);
//     console.log(`✅ ${createdComments.length} comentarios creados exitosamente`);
//     console.log('ℹ️  Nota: Los post_id son ficticios hasta que el modelo Post esté disponible');
//   } catch (error: any) {
//     console.error('❌ Error seeding comments:', error.message);
//     // Si el error es por FK de post_id, informar claramente
//     if (error.message.includes('foreign key constraint')) {
//       console.log('\n⚠️  ERROR: Los posts referenciados no existen en la base de datos.');
//       console.log('💡 Solución: Crea posts manualmente o espera el seeder de posts.');
//       console.log('💡 Alternativa: Comenta temporalmente las FK en el modelo Comment.');
//     }
//     throw error;
//   }
// };
// // Exportar también como default para compatibilidad
// export default seedComments;
// src/database/seeders/03-comments.ts
/**
 * SEEDER DE COMENTARIOS
 */
const Comment_1 = require("../../models/Comment");
const User_1 = require("../../models/User");
const GobModelPost_1 = __importDefault(require("../../models/GobModelPost")); // ✅ Ya disponible
const seedComments = async () => {
    try {
        console.log('📝 Iniciando seed de comentarios...');
        // Verificar si ya existen comentarios
        const existingComments = await Comment_1.Comment.count();
        if (existingComments > 0) {
            console.log('ℹ️  Ya existen comentarios. Saltando seed...');
            return;
        }
        // Verificar que existen usuarios
        const users = await User_1.User.findAll({ limit: 5 });
        if (!users || users.length === 0) {
            console.log('⚠️  No hay usuarios en la base de datos.');
            console.log('💡 Ejecuta primero el seeder de usuarios.');
            console.log('ℹ️  Saltando seeder de comentarios...');
            return;
        }
        // Verificar que existen posts
        const posts = await GobModelPost_1.default.findAll({ limit: 5 });
        if (!posts || posts.length === 0) {
            console.log('⚠️  No hay posts en la base de datos.');
            console.log('💡 Ejecuta primero el seeder de posts/fossils.');
            console.log('ℹ️  Saltando seeder de comentarios...');
            return;
        }
        console.log(`   📊 Usuarios disponibles: ${users.length}`);
        console.log(`   📊 Posts disponibles: ${posts.length}`);
        // Datos de comentarios de prueba
        const commentsData = [
            {
                content: '¡Increíble descubrimiento! Me encanta la paleontología. Siempre he sido un apasionado de los dinosaurios.',
                user_id: users[0].id,
                post_id: posts[0].id,
            },
            {
                content: 'Muy interesante, gracias por compartir esta información tan detallada sobre este fósil.',
                user_id: users[1]?.id || users[0].id,
                post_id: posts[0].id,
            },
            {
                content: 'Wow, no sabía esto sobre los dinosaurios del Cretácico. Fascinante el nivel de detalle.',
                user_id: users[2]?.id || users[0].id,
                post_id: posts[1]?.id || posts[0].id,
            },
            {
                content: 'Excelente artículo. ¿Tienes más información sobre este tema? Me gustaría profundizar.',
                user_id: users[1]?.id || users[0].id,
                post_id: posts[1]?.id || posts[0].id,
            },
            {
                content: '¿En qué museo se exhibe este fósil? Me gustaría verlo en persona con mi familia.',
                user_id: users[3]?.id || users[0].id,
                post_id: posts[0].id,
            },
            {
                content: 'Gran trabajo documentando este hallazgo. La paleontología es fascinante.',
                user_id: users[2]?.id || users[0].id,
                post_id: posts[2]?.id || posts[0].id,
            },
            {
                content: 'Interesante periodo geológico. ¿Cuántos años tiene aproximadamente este fósil?',
                user_id: users[4]?.id || users[0].id,
                post_id: posts[1]?.id || posts[0].id,
            },
            {
                content: 'Me encanta cómo explicas conceptos complejos de forma sencilla. Muy didáctico.',
                user_id: users[0].id,
                post_id: posts[2]?.id || posts[0].id,
            }
        ];
        // Crear comentarios
        const createdComments = await Comment_1.Comment.bulkCreate(commentsData);
        console.log(`✅ ${createdComments.length} comentarios creados exitosamente`);
    }
    catch (error) {
        console.error('❌ Error al crear comentarios:', error);
        // Mensajes de error más específicos
        if (error.message.includes('foreign key constraint')) {
            console.log('\n⚠️  ERROR: Foreign key constraint failed');
            console.log('💡 Verifica que existen usuarios y posts en la base de datos');
            console.log('💡 Ejecuta los seeders en el orden correcto: users -> posts -> comments');
        }
        throw error;
    }
};
exports.seedComments = seedComments;
/**
 * Eliminar todos los comentarios (para testing)
 */
const clearComments = async () => {
    try {
        await Comment_1.Comment.destroy({ where: {}, force: true });
        console.log('🗑️  Comentarios eliminados');
    }
    catch (error) {
        console.error('❌ Error al eliminar comentarios:', error);
        throw error;
    }
};
exports.clearComments = clearComments;
exports.default = exports.seedComments;
//# sourceMappingURL=03-comments.js.map
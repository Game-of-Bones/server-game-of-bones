/**
 * SEEDER DE POSTS - DESARROLLO
 *
 * Propósito:
 * - Crear posts (descubrimientos de fósiles) para desarrollo
 * - Datos variados con diferentes tipos de fósiles
 * - Incluye posts publicados y en borrador
 *
 * Requisitos previos:
 * - Usuarios deben existir (ejecutar 01-users primero)
 *
 * Uso:
 * - npm run seed:dev
 */

import { Post } from '../../models/Post';
import { User } from '../../models/User';

export const seedPosts = async (): Promise<void> => {
  try {
    console.log('🦴 Seeding posts (desarrollo)...');

    // Obtener usuarios para asignar como autores
    const users = await User.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios. Ejecuta el seeder de usuarios primero.');
      console.log('💡 Comando: npm run seed:dev');
      return;
    }

    // Datos de posts variados para desarrollo
    const postsData = [
      // Post 1: T-Rex
      {
        title: 'Descubrimiento de un Tiranosaurio Rex en Patagonia',
        summary: 'Un increíble hallazgo paleontológico en el sur de Argentina revela restos fósiles de un T-Rex casi completo. Este descubrimiento aporta nueva información sobre su morfología y comportamiento durante el Cretácico Superior.',
        image_url: 'https://example.com/images/t-rex-fossil.jpg',
        discovery_date: new Date('2022-03-15'),
        location: 'Patagonia, Argentina',
        paleontologist: 'Dr. Luis Herrera',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        user_id: users[0].id,
        status: 'published' as const,
        source: 'Revista Paleontology Today',
      },

      // Post 2: Plantas del Sahara
      {
        title: 'Fósiles de plantas prehistóricas en el Sahara',
        summary: 'Se descubrieron impresiones fósiles de plantas en capas rocosas del Sahara, demostrando que esta región fue un ecosistema húmedo hace millones de años.',
        image_url: 'https://example.com/images/sahara-plants.jpg',
        discovery_date: new Date('2021-08-09'),
        location: 'Desierto del Sahara, Egipto',
        paleontologist: 'Dra. Amina Khalil',
        fossil_type: 'plant_impressions' as const,
        geological_period: 'Jurásico',
        user_id: users[1]?.id || users[0].id,
        status: 'published' as const,
        source: 'Egyptian Journal of Geoscience',
      },

      // Post 3: Insectos en ámbar
      {
        title: 'Insectos atrapados en ámbar báltico',
        summary: 'Restos de insectos perfectamente conservados en ámbar permiten estudiar la biodiversidad del Eoceno con un nivel de detalle sorprendente.',
        image_url: 'https://example.com/images/amber-insects.jpg',
        discovery_date: new Date('2020-11-22'),
        location: 'Bosques bálticos, Polonia',
        paleontologist: 'Dr. Erik Novak',
        fossil_type: 'amber_insects' as const,
        geological_period: 'Eoceno',
        user_id: users[2]?.id || users[0].id,
        status: 'published' as const,
        source: 'Nature Historical Biology',
      },

      // Post 4: Huellas de dinosaurio (borrador)
      {
        title: 'Huella de dinosaurio descubierta en Utah',
        summary: 'Un grupo de paleontólogos encontró una serie de huellas fosilizadas que revelan el comportamiento de manadas de dinosaurios carnívoros.',
        image_url: 'https://example.com/images/dino-tracks.jpg',
        discovery_date: new Date('2023-04-30'),
        location: 'Utah, Estados Unidos',
        paleontologist: 'Dr. Amanda Lewis',
        fossil_type: 'tracks_traces' as const,
        geological_period: 'Cretácico Inferior',
        user_id: users[1]?.id || users[0].id,
        status: 'draft' as const,
        source: 'Journal of Vertebrate Paleontology',
      },

      // Post 5: Trilobite
      {
        title: 'Trilobite perfectamente preservado en Marruecos',
        summary: 'Un trilobite de 450 millones de años encontrado en excelente estado de conservación en una cantera de Marruecos.',
        image_url: 'https://example.com/images/trilobite.jpg',
        discovery_date: new Date('2023-01-12'),
        location: 'Erfoud, Marruecos',
        paleontologist: 'Dr. Hassan Bennani',
        fossil_type: 'shell_exoskeletons' as const,
        geological_period: 'Ordovícico',
        user_id: users[3]?.id || users[0].id,
        status: 'published' as const,
        source: 'Moroccan Journal of Paleontology',
      },

      // Post 6: Velociraptor (borrador)
      {
        title: 'Esqueleto completo de Velociraptor en Mongolia',
        summary: 'Descubrimiento de un esqueleto casi completo de Velociraptor que preserva detalles únicos de su estructura ósea.',
        discovery_date: new Date('2023-06-20'),
        location: 'Desierto de Gobi, Mongolia',
        paleontologist: 'Dra. Oyuna Baatar',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        user_id: users[4]?.id || users[0].id,
        status: 'draft' as const,
      },
    ];

    // Insertar posts en la base de datos
    const createdPosts = await Post.bulkCreate(postsData);

    console.log(`✅ ${createdPosts.length} posts creados exitosamente`);
    console.log(`   📊 Publicados: ${createdPosts.filter(p => p.status === 'published').length}`);
    console.log(`   📝 Borradores: ${createdPosts.filter(p => p.status === 'draft').length}`);

  } catch (error: any) {
    console.error('❌ Error seeding posts:', error.message);
    throw error;
  }
};

export default seedPosts;

/**
 * SEEDER DE POSTS (FÓSILES)
 */

import Fossil from '../../models/GobModelPost';
import { User } from '../../models/User';

export const seedPosts = async (): Promise<void> => {
  try {
    console.log('🦴 Seeding posts (fósiles)...');

    // Verificar si existen usuarios (para relacionar con author_id)
    const users = await User.findAll();

    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos.');
      console.log('💡 Crea algunos usuarios manualmente o espera el seeder de usuarios.');
      console.log('ℹ️  Saltando seeder de posts...');
      return;
    }

    // Datos de ejemplo de fósiles (posts)
    const postsData = [
      {
        title: 'Descubrimiento de un Tiranosaurio Rex en Patagonia',
        summary:
          'Un increíble hallazgo paleontológico en el sur de Argentina revela restos fósiles de un T-Rex casi completo. Este descubrimiento aporta nueva información sobre su morfología y comportamiento.',
        image_url: 'https://example.com/images/t-rex-fossil.jpg',
        discovery_date: '2022-03-15',
        location: 'Patagonia, Argentina',
        paleontologist: 'Dr. Luis Herrera',
        fossil_type: 'bones_teeth',
        geological_period: 'Cretácico Superior',
        author_id: users[0].id,
        status: 'published',
        source: 'Revista Paleontology Today',
      },
      {
        title: 'Fósiles de plantas prehistóricas en el Sahara',
        summary:
          'Se descubrieron impresiones fósiles de plantas en capas rocosas del Sahara, lo que demuestra que esta región fue un ecosistema húmedo hace millones de años.',
        image_url: 'https://example.com/images/sahara-plants.jpg',
        discovery_date: '2021-08-09',
        location: 'Desierto del Sahara, Egipto',
        paleontologist: 'Dra. Amina Khalil',
        fossil_type: 'plant_impressions',
        geological_period: 'Jurásico',
        author_id: users[1]?.id || users[0].id,
        status: 'published',
        source: 'Egyptian Journal of Geoscience',
      },
      {
        title: 'Insectos atrapados en ámbar báltico',
        summary:
          'Restos de insectos perfectamente conservados en ámbar permiten estudiar la biodiversidad del Eoceno con un nivel de detalle sorprendente.',
        image_url: 'https://example.com/images/amber-insects.jpg',
        discovery_date: '2020-11-22',
        location: 'Bosques bálticos, Polonia',
        paleontologist: 'Dr. Erik Novak',
        fossil_type: 'amber_insects',
        geological_period: 'Eoceno',
        author_id: users[0].id,
        status: 'published',
        source: 'Nature Historical Biology',
      },
      {
        title: 'Huella de dinosaurio descubierta en Utah',
        summary:
          'Un grupo de paleontólogos encontró una serie de huellas fosilizadas que revelan el comportamiento de manadas de dinosaurios carnívoros.',
        image_url: 'https://example.com/images/dino-tracks.jpg',
        discovery_date: '2023-04-30',
        location: 'Utah, Estados Unidos',
        paleontologist: 'Dr. Amanda Lewis',
        fossil_type: 'tracks_traces',
        geological_period: 'Cretácico Inferior',
        author_id: users[1]?.id || users[0].id,
        status: 'draft',
        source: 'Journal of Vertebrate Paleontology',
      },
    ];

    // Insertar en la base de datos
    const createdPosts = await Fossil.bulkCreate(postsData);

    console.log(`✅ ${createdPosts.length} posts (fósiles) creados exitosamente`);
  } catch (error: any) {
    console.error('❌ Error seeding posts:', error.message);
    throw error;
  }
};

// Exportar también por defecto para compatibilidad
export default seedPosts;

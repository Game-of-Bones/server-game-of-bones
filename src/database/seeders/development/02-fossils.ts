import Fossil from '../../../models/Posts';
import { User } from '../../../models/User';

export const seedFossils = async (): Promise<void> => {
  try {
    console.log('🦴 Iniciando seed de fósiles (desarrollo)...');

    const existing = await Fossil.count();
    if (existing > 0) {
      console.log('ℹ️  Ya existen fósiles. Saltando seed...');
      return;
    }

    const users = await User.findAll();
    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios.');
      return;
    }

    const admin = users.find(u => u.role === 'admin') || users[0];
    const regularUsers = users.filter(u => u.role === 'user');

    const data = [
      {
        title: 'Tyrannosaurus Rex - El Rey de los Dinosaurios',
        summary: 'El T-rex es uno de los carnívoros terrestres más grandes. Con 12 metros de longitud, este depredador del Cretácico Superior dominaba su ecosistema.',
        image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853',
        discovery_date: new Date('1902-08-12'),
        location: 'Hell Creek Formation, Montana, USA',
        paleontologist: 'Barnum Brown',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: admin.id,
        status: 'published' as const,
        source: 'American Museum of Natural History'
      },
      {
        title: 'Triceratops: El Gigante Herbívoro',
        summary: 'Reconocible por sus tres cuernos y collar óseo. Podía alcanzar 9 metros y pesar 12 toneladas.',
        image_url: 'https://images.unsplash.com/photo-1596003906949-67221c37965c',
        discovery_date: new Date('1887-03-15'),
        location: 'Denver, Colorado, USA',
        paleontologist: 'Othniel Charles Marsh',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: regularUsers[0]?.id || admin.id,
        status: 'published' as const,
        source: 'Smithsonian Institution'
      },
      {
        title: 'Velociraptor: El Cazador Ágil',
        summary: 'Depredador ágil e inteligente de aproximadamente 2 metros de largo y 15 kg.',
        image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819',
        discovery_date: new Date('1923-08-11'),
        location: 'Gobi Desert, Mongolia',
        paleontologist: 'Peter Kaisen',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: regularUsers[1]?.id || admin.id,
        status: 'published' as const,
        source: 'American Museum of Natural History'
      },
      {
        title: 'Stegosaurus: El Dinosaurio con Placas Dorsales',
        summary: 'Famoso por sus placas óseas y cuatro púas en la cola. Medía hasta 9 metros.',
        image_url: 'https://images.unsplash.com/photo-1551532828-c9f8d8b5b999',
        discovery_date: new Date('1877-06-20'),
        location: 'Morrison Formation, Colorado, USA',
        paleontologist: 'Othniel Charles Marsh',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Jurásico Superior',
        author_id: regularUsers[2]?.id || admin.id,
        status: 'published' as const,
        source: 'Natural History Museum, London'
      }
    ];

    const created = await Fossil.bulkCreate(data);
    console.log(`✅ ${created.length} fósiles creados (desarrollo)`);

  } catch (error: any) {
    console.error('❌ Error al crear fósiles:', error);
    throw error;
  }
};

export default seedFossils;
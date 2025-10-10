// src/database/seeders/02-fossils.ts
/**
 * SEEDER DE FÓSILES/POSTS
 */

import Fossil from '../../models/GobModelPost';
import { User } from '../../models/User';

export const seedFossils = async (): Promise<void> => {
  try {
    console.log('🦴 Iniciando seed de fósiles...');

    // Verificar si ya existen fósiles
    const existingFossils = await Fossil.count();
    if (existingFossils > 0) {
      console.log('ℹ️  Ya existen fósiles. Saltando seed...');
      return;
    }

    // Obtener usuarios para asignar como autores
    const users = await User.findAll();
    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos.');
      console.log('💡 Ejecuta primero el seeder de usuarios.');
      console.log('ℹ️  Saltando seeder de fósiles...');
      return;
    }

    // Buscar el admin para algunos posts
    const adminUser = users.find(u => u.role === 'admin') || users[0];
    const regularUsers = users.filter(u => u.role === 'user');

    console.log(`   📊 Usuarios disponibles: ${users.length}`);

    // Datos de fósiles de prueba
    const fossilsData = [
      {
        title: 'Tyrannosaurus Rex - El Rey de los Dinosaurios',
        summary: 'El Tyrannosaurus rex es uno de los carnívoros terrestres más grandes que jamás hayan existido. Con hasta 12 metros de longitud y 4 metros de altura, este depredador del Cretácico Superior dominaba su ecosistema.',
        image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853',
        discovery_date: new Date('1902-08-12'),
        location: 'Hell Creek Formation, Montana, USA',
        paleontologist: 'Barnum Brown',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: adminUser.id,
        status: 'published' as const,
        source: 'American Museum of Natural History'
      },
      {
        title: 'Triceratops: El Gigante Herbívoro con Tres Cuernos',
        summary: 'El Triceratops es reconocible por sus tres cuernos y su gran collar óseo. Este herbívoro del Cretácico tardío podía alcanzar 9 metros de longitud y pesar hasta 12 toneladas.',
        image_url: 'https://images.unsplash.com/photo-1596003906949-67221c37965c',
        discovery_date: new Date('1887-03-15'),
        location: 'Denver, Colorado, USA',
        paleontologist: 'Othniel Charles Marsh',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: regularUsers[0]?.id || adminUser.id,
        status: 'published' as const,
        source: 'Smithsonian Institution'
      },
      {
        title: 'Velociraptor: El Cazador Ágil del Cretácico',
        summary: 'Aunque más pequeño de lo que Hollywood sugiere, el Velociraptor era un depredador ágil e inteligente. Medía aproximadamente 2 metros de largo y pesaba unos 15 kg.',
        image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819',
        discovery_date: new Date('1923-08-11'),
        location: 'Gobi Desert, Mongolia',
        paleontologist: 'Peter Kaisen',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Cretácico Superior',
        author_id: regularUsers[1]?.id || adminUser.id,
        status: 'published' as const,
        source: 'American Museum of Natural History'
      },
      {
        title: 'Stegosaurus: El Dinosaurio con Placas Dorsales',
        summary: 'El Stegosaurus es famoso por sus distintivas placas óseas en el lomo y sus cuatro púas en la cola. Este herbívoro del Jurásico Superior medía hasta 9 metros de longitud.',
        image_url: 'https://images.unsplash.com/photo-1551532828-c9f8d8b5b999',
        discovery_date: new Date('1877-06-20'),
        location: 'Morrison Formation, Colorado, USA',
        paleontologist: 'Othniel Charles Marsh',
        fossil_type: 'bones_teeth' as const,
        geological_period: 'Jurásico Superior',
        author_id: regularUsers[2]?.id || adminUser.id,
        status: 'published' as const,
        source: 'Natural History Museum, London'
      },
      {
        title: 'Ammonites: Moluscos Cefalópodos Extintos',
        summary: 'Los ammonites eran moluscos marinos con conchas en espiral que vivieron durante millones de años. Son fósiles índice cruciales para datar rocas sedimentarias.',
        image_url: 'https://images.unsplash.com/photo-1607935011467-c6e6dd45fcdc',
        discovery_date: new Date('1800-01-01'),
        location: 'Diversos sitios en Europa',
        paleontologist: 'Varios investigadores',
        fossil_type: 'shell_exoskeletons' as const,
        geological_period: 'Devónico-Cretácico',
        author_id: adminUser.id,
        status: 'published' as const,
        source: 'Multiple European Museums'
      },
      {
        title: 'Archaeopteryx: El Eslabón entre Dinosaurios y Aves',
        summary: 'Considerado uno de los fósiles transicionales más importantes, el Archaeopteryx muestra características tanto de dinosaurios como de aves modernas.',
        image_url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600',
        discovery_date: new Date('1861-09-01'),
        location: 'Solnhofen, Bavaria, Germany',
        paleontologist: 'Hermann von Meyer',
        fossil_type: 'plant_impressions' as const,
        geological_period: 'Jurásico Superior',
        author_id: regularUsers[0]?.id || adminUser.id,
        status: 'draft' as const,
        source: 'Natural History Museum, Berlin'
      },
      {
        title: 'Huellas de Dinosaurio en la Patagonia',
        summary: 'Descubrimiento reciente de huellas de dinosaurio saurópodo en la Patagonia argentina. Las huellas revelan información sobre el comportamiento y locomoción de estos gigantes.',
        discovery_date: new Date('2020-05-15'),
        location: 'Neuquén, Patagonia, Argentina',
        paleontologist: 'Dr. Alejandro Otero',
        fossil_type: 'tracks_traces' as const,
        geological_period: 'Cretácico Inferior',
        author_id: regularUsers[1]?.id || adminUser.id,
        status: 'published' as const,
        source: 'CONICET Argentina'
      },
      {
        title: 'Insecto Preservado en Ámbar del Cretácico',
        summary: 'Un pequeño insecto perfectamente preservado en ámbar proporciona una ventana única al ecosistema del Cretácico. El detalle de preservación es excepcional.',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
        discovery_date: new Date('2019-11-30'),
        location: 'Myanmar',
        paleontologist: 'Dr. Lida Xing',
        fossil_type: 'amber_insects' as const,
        geological_period: 'Cretácico Medio',
        author_id: adminUser.id,
        status: 'published' as const,
        source: 'Chinese Academy of Sciences'
      }
    ];

    // Crear fósiles
    const createdFossils = await Fossil.bulkCreate(fossilsData);

    console.log(`✅ ${createdFossils.length} fósiles creados exitosamente`);
    console.log(`   📝 Published: ${createdFossils.filter(f => f.status === 'published').length}`);
    console.log(`   📝 Draft: ${createdFossils.filter(f => f.status === 'draft').length}`);

  } catch (error: any) {
    console.error('❌ Error al crear fósiles:', error);

    if (error.message.includes('foreign key constraint')) {
      console.log('\n⚠️  ERROR: Foreign key constraint failed');
      console.log('💡 Verifica que existen usuarios en la base de datos');
      console.log('💡 Ejecuta primero el seeder de usuarios');
    }

    throw error;
  }
};

/**
 * Eliminar todos los fósiles (para testing)
 */
export const clearFossils = async (): Promise<void> => {
  try {
    await Fossil.destroy({ where: {}, force: true });
    console.log('🗑️  Fósiles eliminados');
  } catch (error) {
    console.error('❌ Error al eliminar fósiles:', error);
    throw error;
  }
};

export default seedFossils;

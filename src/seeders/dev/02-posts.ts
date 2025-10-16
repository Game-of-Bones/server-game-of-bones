/**
 * POSTS SEEDER - DEVELOPMENT
 *
 * Crea posts de descubrimientos con imágenes y coordenadas
 */

import { Post } from '../../models/Post';

export const seedPosts = async (): Promise<void> => {
  console.log('🌱 Seeding posts...');

  const posts = [
    {
      title: 'Joaquinraptor casali - Carnívoro del Cretácico',
      summary: 'Un nuevo carnívoro de tamaño mediano que habitó La Pampa hace 80 millones de años. Sus restos fueron encontrados en formaciones del Cretácico Superior y representa una nueva especie de terópodo sudamericano. El análisis de sus dientes sugiere una dieta carnívora especializada.',
      image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      discovery_date: new Date('2023-03-15'),
      location: 'La Pampa, Argentina',
      latitude: -36.6167,
      longitude: -64.2833,
      paleontologist: 'Dr. María Fernández',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Cretácico Superior',
      user_id: 2,
      status: 'published' as const,
      source: 'https://www.nature.com/articles/example1',
    },
    {
      title: 'Qunkasaura pintiquiniestra - Dinosaurio austral',
      summary: 'Herbívoro de gran tamaño descubierto en la Patagonia chilena. Vivió durante el Cretácico y sus restos incluyen vértebras y costillas excepcionalmente preservadas. Este hallazgo amplía nuestro conocimiento sobre la fauna de dinosaurios en el extremo sur de América.',
      image_url: 'https://images.unsplash.com/photo-1597450001842-d8a8c0e2c9b0?w=800',
      discovery_date: new Date('2023-06-22'),
      location: 'Magallanes, Chile',
      latitude: -51.7167,
      longitude: -72.5000,
      paleontologist: 'Dr. Carlos Muñoz',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Cretácico',
      user_id: 3,
      status: 'published' as const,
      source: 'https://www.sciencedirect.com/example2',
    },
    {
      title: 'Tyrannotitan - Gigante del Cretácico Inferior',
      summary: 'Uno de los carnívoros más grandes que habitaron Sudamérica. Encontrado en Chubut, Argentina, este depredador podía alcanzar los 12 metros de longitud. Sus poderosas mandíbulas y dientes afilados lo convierten en uno de los terópodos más impresionantes del continente.',
      image_url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800',
      discovery_date: new Date('2023-01-10'),
      location: 'Chubut, Argentina',
      latitude: -43.3000,
      longitude: -65.1000,
      paleontologist: 'Dra. Ana Rodríguez',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Cretácico Inferior',
      user_id: 4,
      status: 'published' as const,
      source: 'https://journals.plos.org/example3',
    },
    {
      title: 'Ammonites gigantes del Jurásico',
      summary: 'Colección de ammonites de tamaño excepcional encontrados en sedimentos marinos. Estos moluscos extintos muestran patrones de crecimiento únicos y proporcionan información valiosa sobre los ecosistemas marinos del Jurásico. Algunos especímenes alcanzan más de 50 cm de diámetro.',
      image_url: 'https://images.unsplash.com/photo-1572737117164-e81e5ab18f8b?w=800',
      discovery_date: new Date('2023-08-05'),
      location: 'Neuquén, Argentina',
      latitude: -38.9516,
      longitude: -68.0591,
      paleontologist: 'Dr. Jorge Calvo',
      fossil_type: 'shell_exoskeletons' as const,
      geological_period: 'Jurásico',
      user_id: 2,
      status: 'published' as const,
    },
    {
      title: 'Bosque petrificado del Triásico',
      summary: 'Impresiones fósiles de helechos y coníferas primitivas en excelente estado de conservación. Este yacimiento ofrece una ventana única a los ecosistemas forestales del Triásico, mostrando la diversidad de flora que existía hace más de 200 millones de años.',
      image_url: 'https://images.unsplash.com/photo-1520982520209-3c0d5e8fc5ee?w=800',
      discovery_date: new Date('2023-04-18'),
      location: 'San Juan, Argentina',
      latitude: -31.5375,
      longitude: -68.5364,
      paleontologist: 'Dra. Laura Salgado',
      fossil_type: 'plant_impressions' as const,
      geological_period: 'Triásico',
      user_id: 5,
      status: 'published' as const,
    },
    {
      title: 'Huellas de Saurópodos en la Patagonia',
      summary: 'Rastros fosilizados de dinosaurios herbívoros de cuello largo. Las huellas revelan el comportamiento de manada y rutas migratorias. Este descubrimiento incluye más de 100 icnitas que permiten reconstruir el paso de una gran manada.',
      image_url: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=800',
      discovery_date: new Date('2023-09-30'),
      location: 'Santa Cruz, Argentina',
      latitude: -50.0111,
      longitude: -68.5289,
      paleontologist: 'Dr. Pablo Puerta',
      fossil_type: 'tracks_traces' as const,
      geological_period: 'Cretácico',
      user_id: 3,
      status: 'published' as const,
    },
    {
      title: 'Insectos atrapados en ámbar cretácico',
      summary: 'Colección de insectos perfectamente preservados en ámbar, incluyendo escarabajos, hormigas y arañas. Estos fósiles proporcionan detalles extraordinarios de la anatomía de insectos extintos y su relación con especies actuales.',
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      discovery_date: new Date('2023-07-12'),
      location: 'Misiones, Argentina',
      latitude: -27.3669,
      longitude: -55.9003,
      paleontologist: 'Dr. Ricardo Martínez',
      fossil_type: 'amber_insects' as const,
      geological_period: 'Cretácico',
      user_id: 4,
      status: 'published' as const,
    },
    {
      title: 'Pterosaurio del Jurásico tardío - BORRADOR',
      summary: 'Restos parciales de un reptil volador con una envergadura estimada de 5 metros. Hallazgo en proceso de estudio y clasificación. Este espécimen muestra características únicas en la morfología de las alas.',
      image_url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800',
      discovery_date: new Date('2024-01-15'),
      location: 'Mendoza, Argentina',
      latitude: -32.8895,
      longitude: -68.8458,
      paleontologist: 'Dra. María Fernández',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Jurásico',
      user_id: 2,
      status: 'draft' as const,
    },
  ];

  for (const postData of posts) {
    await Post.create(postData);
  }

  console.log('✅ Posts seeded successfully');
};

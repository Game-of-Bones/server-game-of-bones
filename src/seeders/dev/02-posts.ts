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
      summary:
        'El descubrimiento de *Joaquinraptor casali* representa uno de los hallazgos más fascinantes en la paleontología argentina reciente. Este terópodo carnívoro de tamaño mediano fue hallado en formaciones rocosas del Cretácico Superior en La Pampa. Los restos fósiles incluyen fragmentos craneales, vértebras y dientes bien conservados. El análisis dentario revela bordes aserrados adaptados a desgarrar carne, sugiriendo una dieta especializada. \
        Los sedimentos donde se encontraron los fósiles indican una planicie aluvial con cuerpos de agua temporales, lo que sugiere un ecosistema diverso. Comparaciones morfológicas muestran afinidades con abelisáuridos sudamericanos, aunque con adaptaciones únicas en metatarso y fémur que indican agilidad y rapidez en distancias cortas. El bulbo olfativo desarrollado y las simulaciones biomecánicas muestran un depredador eficiente capaz de ejercer gran fuerza de mordida. \
        Este hallazgo amplía nuestro conocimiento sobre la diversidad de terópodos en Sudamérica y sus patrones de dispersión durante el Cretácico tardío. Actualmente se encuentra en estudio anatómico detallado y forma parte de la colección permanente del Museo Provincial de Ciencias Naturales de La Pampa.',
      image_url: 'https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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
      summary:
        'El herbívoro *Qunkasaura pintiquiniestra* fue descubierto en Magallanes, Chile, y constituye un ejemplar excepcional de la fauna de dinosaurios del Cretácico. Los fósiles incluyen vértebras, costillas y fragmentos de pelvis, conservados con detalles que permiten reconstruir su morfología completa. \
        Este saurópodo probablemente alcanzaba grandes dimensiones y presentaba adaptaciones específicas para sostener un cuerpo masivo, con extremidades robustas y columna vertebral reforzada. Los análisis sedimentológicos sugieren que habitaba planicies aluviales abiertas con vegetación abundante, lo que facilitaba su dieta herbívora especializada. \
        El hallazgo de este dinosaurio contribuye a comprender la diversidad de saurópodos en el extremo sur de Sudamérica, proporcionando información sobre su crecimiento, biomecánica y comportamiento social. El descubrimiento fue liderado por el Dr. Carlos Muñoz y representa un aporte clave para la paleontología chilena.',
      image_url: 'https://images.unsplash.com/photo-1601182207230-1b165dea2212?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176',
      discovery_date: new Date('2023-06-22'),
      location: 'Magallanes, Chile',
      latitude: -51.7167,
      longitude: -72.5,
      paleontologist: 'Dr. Carlos Muñoz',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Cretácico',
      user_id: 3,
      status: 'published' as const,
      source: 'https://www.sciencedirect.com/example2',
    },
    {
      title: 'Tyrannotitan - Gigante del Cretácico Inferior',
      summary:
        'El depredador *Tyrannotitan* fue hallado en Chubut, Argentina, y es uno de los terópodos más grandes de Sudamérica. Este carnívoro alcanzaba aproximadamente 12 metros de longitud, con mandíbulas robustas y dientes afilados que lo convertían en un depredador formidable. \
        Los restos incluyen vértebras dorsales, sacras y fragmentos craneales. El análisis de los huesos indica crecimiento rápido y un metabolismo activo, mientras que su estructura esquelética muestra adaptaciones para cazar presas grandes. \
        El estudio de su paleoambiente sugiere llanuras abiertas con recursos acuáticos estacionales, favoreciendo la coexistencia con herbívoros gigantes y otros depredadores. La Dra. Ana Rodríguez lideró el estudio de este ejemplar, que proporciona información crucial sobre la evolución y diversidad de los terópodos del Cretácico Inferior.',
      image_url: 'https://images.unsplash.com/photo-1505027014503-e6de34d28116?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
      discovery_date: new Date('2023-01-10'),
      location: 'Chubut, Argentina',
      latitude: -43.3,
      longitude: -65.1,
      paleontologist: 'Dra. Ana Rodríguez',
      fossil_type: 'bones_teeth' as const,
      geological_period: 'Cretácico Inferior',
      user_id: 4,
      status: 'published' as const,
      source: 'https://journals.plos.org/example3',
    },
    {
      title: 'Ammonites gigantes del Jurásico',
      summary:
        'Estos ammonites fósiles, descubiertos en Neuquén, Argentina, destacan por su tamaño excepcional y conservación. Cada espécimen permite estudiar patrones de crecimiento y ornamentación de conchas, proporcionando información detallada sobre la ecología marina del Jurásico. \
        Los sedimentos marinos donde se hallaron indican aguas someras con alta biodiversidad, y la presencia de varios individuos permite inferir dinámicas poblacionales y estrategias reproductivas. Los investigadores identificaron especies con diámetros superiores a 50 cm, una rareza que sugiere condiciones ambientales óptimas y ausencia de depredadores grandes en esa región durante su periodo. \
        Este descubrimiento enriquece la comprensión de los ecosistemas mesozoicos marinos de Sudamérica y contribuye al estudio comparativo de ammonites a nivel global.',
      image_url: 'https://images.unsplash.com/photo-1559999127-b8b7f927dab8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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
      summary:
        'El bosque petrificado de San Juan, Argentina, contiene impresiones fósiles de helechos y coníferas primitivas excepcionalmente conservadas. Estos restos permiten reconstruir la vegetación y los ecosistemas forestales del Triásico, ofreciendo una ventana única a la biodiversidad vegetal de hace más de 200 millones de años. \
        Los fósiles muestran detalles de estructuras celulares y patrones de crecimiento, indicando climas templados con estaciones húmedas y secas marcadas. La Dra. Laura Salgado lideró el estudio, proporcionando información sobre la evolución temprana de coníferas y helechos, y cómo estos ecosistemas prehistóricos respondían a cambios ambientales y geológicos.',
      image_url: 'https://images.unsplash.com/photo-1668173272262-3e8c843c4d88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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
      summary:
        'Las icnitas de saurópodos halladas en Santa Cruz, Argentina, constituyen uno de los conjuntos más completos de huellas fosilizadas de herbívoros de cuello largo en Sudamérica. Más de 100 huellas registran el paso de manadas, su comportamiento social y rutas migratorias. \
        El análisis de profundidad y forma de las huellas permite estimar peso, velocidad y tamaño de los individuos. Los sedimentos sugieren una planicie fluvial estacional, con suelos blandos que conservaron las marcas con precisión notable. \
        El estudio de estas huellas aporta información complementaria a los fósiles óseos, ayudando a reconstruir la ecología y dinámica de manadas de saurópodos en el Cretácico patagónico. Dr. Pablo Puerta lideró la investigación, destacando la importancia de icnitas para entender el comportamiento prehistórico.',
      image_url: 'https://images.unsplash.com/photo-1637878301031-31c9ddf9eb1a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
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
      summary:
        'Este conjunto de insectos fósiles atrapados en ámbar de Misiones, Argentina, muestra una preservación extraordinaria, permitiendo estudiar anatomía, relaciones evolutivas y ecología de especies extintas. Escarabajos, hormigas, arañas y otros artrópodos se conservan con detalles microscópicos. \
        Los estudios sugieren un ambiente forestal húmedo donde la resina era abundante, atrapando insectos de manera fortuita pero preservando estructuras que raramente se fosilizan en sedimentos normales. \
        Estos fósiles proporcionan información sobre interacciones tróficas, polinización y competencia ecológica en ecosistemas cretácicos, contribuyendo al conocimiento de la biodiversidad y comportamiento de insectos antiguos.',
      image_url: 'https://images.unsplash.com/photo-1710795723705-f1af3905ae3a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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
      summary:
        'El pterosaurio descubierto en Mendoza, Argentina, corresponde a un reptil volador de gran envergadura, estimada en 5 metros. Los restos incluyen elementos parciales de alas y vértebras, que muestran adaptaciones aerodinámicas únicas. \
        El estudio preliminar sugiere que este ejemplar pertenecía a un clado con estrategias de caza activa y posible alimentación piscívora. Los sedimentos asociados indican un ambiente costero con cuerpos de agua intermitentes, lo que podría haber facilitado la captura de presas acuáticas. \
        Este hallazgo, aún en proceso de investigación y clasificación, proporciona una oportunidad única para entender la diversidad y morfología de pterosaurios del Jurásico tardío en el sur de Sudamérica, complementando registros fósiles previos y ofreciendo nuevas perspectivas sobre su ecología y vuelo.',
      image_url: 'https://images.unsplash.com/photo-1597309650202-c1c098e98dbf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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

// src/database/seeders/development/02-posts.ts
/**
 * SEEDER DE POSTS - DEVELOPMENT
 * ✅ Nombre correcto: 02-posts.ts (no 02-fossils.ts)
 * ✅ Incluye post_content (campo obligatorio)
 */

import Post from "../../../models/Posts";
import { User } from "../../../models/User";

export const seedPosts = async (): Promise<void> => {
  try {
    console.log("📝 Seeding posts (development)...");

    // Verificar si existen usuarios
    const users = await User.findAll();

    if (!users || users.length === 0) {
      console.log("⚠️  No hay usuarios. Saltando seeder de posts...");
      return;
    }

    // Datos de ejemplo
    const postsData = [
      {
        title: "Descubrimiento de un Tiranosaurio Rex en Patagonia",
        summary:
          "Un increíble hallazgo paleontológico en el sur de Argentina revela restos fósiles de un T-Rex casi completo.",
        post_content: `
          <h2>El hallazgo del siglo</h2>
          <p>En marzo de 2022, un equipo de paleontólogos argentinos descubrió los restos casi completos de un Tiranosaurio Rex en la Patagonia argentina.</p>
          
          <h3>Detalles del descubrimiento</h3>
          <p>El fósil se encontró en un estado excepcional de conservación, lo que permitirá realizar estudios detallados sobre la morfología, comportamiento y alimentación de esta especie.</p>
          
          <ul>
            <li>85% del esqueleto preservado</li>
            <li>Edad estimada: 68 millones de años</li>
            <li>Longitud aproximada: 12 metros</li>
          </ul>
          
          <blockquote>
            "Este descubrimiento cambiará nuestra comprensión sobre los dinosaurios carnívoros en Sudamérica" - Dr. Luis Herrera
          </blockquote>
        `,
        image_url: "https://picsum.photos/seed/trex/800/600",
        discovery_date: new Date("2022-03-15"),
        location: "Patagonia, Argentina",
        paleontologist: "Dr. Luis Herrera",
        fossil_type: "bones_teeth" as const,
        geological_period: "Cretácico Superior",
        author_id: users[0].id,
        status: "published" as const,
        source: "Revista Paleontology Today",
      },
      {
        title: "Fósiles de plantas prehistóricas en el Sahara",
        summary:
          "Impresiones fósiles de plantas demuestran que el Sahara fue un ecosistema húmedo hace millones de años.",
        post_content: `
          <h2>El Sahara verde</h2>
          <p>Nuevas evidencias revelan que el desierto del Sahara fue una región tropical repleta de vegetación durante el Jurásico.</p>
          
          <h3>Especies encontradas</h3>
          <p>Se identificaron más de 50 especies diferentes de plantas fosilizadas, incluyendo helechos gigantes y coníferas primitivas.</p>
          
          <p>Este descubrimiento proporciona información crucial sobre el cambio climático y la evolución de los ecosistemas terrestres.</p>
        `,
        image_url: "https://picsum.photos/seed/sahara/800/600",
        discovery_date: new Date("2021-08-09"),
        location: "Desierto del Sahara, Egipto",
        paleontologist: "Dra. Amina Khalil",
        fossil_type: "plant_impressions" as const,
        geological_period: "Jurásico",
        author_id: users[1]?.id || users[0].id,
        status: "published" as const,
        source: "Egyptian Journal of Geoscience",
      },
      {
        title: "Insectos atrapados en ámbar báltico",
        summary:
          "Insectos perfectamente conservados en ámbar revelan detalles sorprendentes del Eoceno.",
        post_content: `
          <h2>Una ventana al pasado</h2>
          <p>El ámbar báltico ha preservado insectos con un nivel de detalle microscópico, permitiendo estudiar estructuras que normalmente no se fosilizan.</p>
          
          <h3>Hallazgos destacados</h3>
          <ul>
            <li>Abejas con polen visible</li>
            <li>Arañas con telarañas intactas</li>
            <li>Mosquitos con restos de sangre</li>
          </ul>
          
          <p>Estos fósiles tienen aproximadamente 44 millones de años de antigüedad.</p>
        `,
        image_url: "https://picsum.photos/seed/amber/800/600",
        discovery_date: new Date("2020-11-22"),
        location: "Bosques bálticos, Polonia",
        paleontologist: "Dr. Erik Novak",
        fossil_type: "amber_insects" as const,
        geological_period: "Eoceno",
        author_id: users[0].id,
        status: "published" as const,
        source: "Nature Historical Biology",
      },
      {
        title: "Huellas de dinosaurio descubiertas en Utah",
        summary:
          "Serie de huellas fosilizadas revelan el comportamiento de manadas de dinosaurios carnívoros.",
        post_content: `
          <h2>Rastreando el pasado</h2>
          <p>Un yacimiento en Utah ha revelado más de 200 huellas de dinosaurios carnívoros, proporcionando evidencia directa de comportamiento grupal.</p>
          
          <h3>Análisis de las huellas</h3>
          <p>Las huellas sugieren que estos depredadores cazaban en grupos coordinados, similar a los lobos modernos.</p>
          
          <p><em>Este descubrimiento está actualmente en estudio detallado.</em></p>
        `,
        image_url: "https://picsum.photos/seed/tracks/800/600",
        discovery_date: new Date("2023-04-30"),
        location: "Utah, Estados Unidos",
        paleontologist: "Dr. Amanda Lewis",
        fossil_type: "tracks_traces" as const,
        geological_period: "Cretácico Inferior",
        author_id: users[1]?.id || users[0].id,
        status: "draft" as const,
        source: "Journal of Vertebrate Paleontology",
      },
      {
        title: "Exoesqueleto de trilobites en perfecto estado",
        summary:
          "Fósiles de trilobites con detalles microscópicos revelan su anatomía externa completa.",
        post_content: `
          <h2>Los guardianes del Cámbrico</h2>
          <p>Los trilobites dominaron los océanos durante más de 270 millones de años.</p>
          
          <p>Este ejemplar muestra estructuras nunca antes vistas en este nivel de detalle.</p>
        `,
        image_url: "https://picsum.photos/seed/trilobite/800/600",
        discovery_date: new Date("2021-05-12"),
        location: "Marruecos",
        paleontologist: "Dr. Hassan El-Fassi",
        fossil_type: "shell_exoskeletons" as const,
        geological_period: "Cámbrico",
        author_id: users[0].id,
        status: "published" as const,
        source: "Geological Society of Morocco",
      },
    ];

    // Insertar en BD
    const created = await Post.bulkCreate(postsData);

    console.log(`✅ ${created.length} posts creados exitosamente`);
  } catch (error: any) {
    console.error("❌ Error seeding posts:", error.message);
    throw error;
  }
};

export default seedPosts;
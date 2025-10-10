// src/server/seeders/development/04-likes.ts
import { Like } from '../../../models/Like';
import { User } from '../../../models/User';
import Fossil from '../../../models/GobModelPost';

export const seedLikes = async (): Promise<void> => {
  try {
    console.log('❤️  Iniciando seed de likes (desarrollo)...');

    const existing = await Like.count();
    if (existing > 0) {
      console.log('ℹ️  Ya existen likes. Saltando seed...');
      return;
    }

    const users = await User.findAll({ limit: 10 });
    const posts = await Fossil.findAll({ limit: 10 });

    if (!users.length || !posts.length) {
      console.log('⚠️  Faltan usuarios o posts.');
      return;
    }

    const data: Array<{ user_id: number; post_id: number }> = [];

    // Admin da like a varios posts
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      data.push(
        { user_id: admin.id, post_id: posts[0].id },
        { user_id: admin.id, post_id: posts[1]?.id || posts[0].id }
      );
    }

    // Usuarios regulares dan likes
    users.slice(0, 5).forEach((user, i) => {
      const numLikes = 2 + (i % 3);
      for (let j = 0; j < numLikes && j < posts.length; j++) {
        const postIndex = (i + j) % posts.length;
        data.push({
          user_id: user.id,
          post_id: posts[postIndex].id
        });
      }
    });

    // Eliminar duplicados
    const unique = data.filter((like, index, self) =>
      index === self.findIndex(l => 
        l.user_id === like.user_id && l.post_id === like.post_id
      )
    );

    const created = await Like.bulkCreate(unique);
    console.log(`✅ ${created.length} likes creados (desarrollo)`);

  } catch (error: any) {
    console.error('❌ Error al crear likes:', error);
    throw error;
  }
};

export default seedLikes;
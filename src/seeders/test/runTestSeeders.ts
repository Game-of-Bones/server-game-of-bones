/**
 * RUN TEST SEEDERS
 */

import sequelize from '../../database/database';
import { seedTestUsers } from './users.seed';
import { seedTestPosts } from './post.seed';
import { seedTestComments } from './comment.seed';
import { seedTestLikes } from './likes.seed';

const runTestSeeders = async (): Promise<void> => {
  try {
    console.log('🧪 Starting test seeders...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized\n');

    await seedTestUsers();
    await seedTestPosts();
    await seedTestComments();
    await seedTestLikes();

    console.log('\n✅ All test seeders completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running test seeders:', error);
    process.exit(1);
  }
};

runTestSeeders();

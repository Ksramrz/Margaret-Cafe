const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Production database URL
const PRODUCTION_DB_URL = 'postgresql://margaret_cafe_db_user:Cgqjwa6a4zrtyvQm5bMbZVnorDvbynWt@dpg-d3mf75ur433s73ajo2g0-a.oregon-postgres.render.com/margaret_cafe_db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || PRODUCTION_DB_URL
    }
  }
});

async function applyMigration() {
  console.log('Applying coin system migration to production database...');
  
  try {
    // Read the SQL migration file
    const sql = fs.readFileSync(
      path.join(__dirname, 'apply-coin-system-migration.sql'),
      'utf8'
    );

    // Execute the migration
    await prisma.$executeRawUnsafe(sql);
    
    console.log('✓ Migration applied successfully!');
    
    // Test the connection
    const userCount = await prisma.user.count();
    console.log(`✓ Database connection verified! Total users: ${userCount}`);
    
  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration()
  .then(() => {
    console.log('\n✓ Production migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });


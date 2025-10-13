// Database migration script to add password column
// This will run automatically on Render deployment

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Check if password column exists
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'password'
    `;
    
    if (columns.length === 0) {
      console.log('Adding password column to User table...');
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "password" TEXT;`;
      console.log('✅ Password column added successfully!');
    } else {
      console.log('✅ Password column already exists.');
    }
    
    // Test the schema by creating and deleting a test user
    console.log('Testing user creation with password...');
    const testUser = await prisma.user.create({
      data: {
        name: 'Migration Test User',
        email: 'migration-test@example.com',
        password: 'test123',
        role: 'USER',
      },
    });
    
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    
    console.log('✅ Database migration completed successfully!');
    console.log('✅ User creation with password works correctly!');
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDatabase };

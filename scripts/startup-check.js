// Startup script to ensure everything is working
// This runs when the application starts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function startupCheck() {
  try {
    console.log('🔍 Running startup checks...');
    
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if password column exists
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'password'
    `;
    
    if (columns.length === 0) {
      console.log('⚠️  Password column missing - adding it now...');
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "password" TEXT;`;
      console.log('✅ Password column added');
    }

    // Check if coin system columns exist
    const coinColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'totalCoins'
    `;

    if (coinColumns.length === 0) {
      console.log('⚠️  Coin system columns missing - adding them now...');
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "totalCoins" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "lastLoginReward" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS "totalPoints" INTEGER DEFAULT 0;
      `;
      console.log('✅ Coin system columns added');
    } else {
      console.log('✅ Coin system columns exist');
    }
    
    console.log('✅ Database schema is correct');
    
    // Check admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user exists:', adminUser.email);
    } else {
      console.log('⚠️  No admin user found');
    }
    
    console.log('🚀 Startup checks completed successfully!');
    
  } catch (error) {
    console.error('❌ Startup check failed:', error);
    // Don't throw error to prevent app crash
  } finally {
    await prisma.$disconnect();
  }
}

// Run startup check
startupCheck();

module.exports = { startupCheck };

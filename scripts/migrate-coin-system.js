const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateCoinSystem() {
  try {
    console.log('Starting coin system migration...');

    // Add coin system columns to User table
    console.log('Adding coin system columns to User table...');
    
    // Note: This needs to be run manually on the database
    const addUserColumnsSQL = `
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "totalCoins" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "lastLoginReward" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "totalPoints" INTEGER DEFAULT 0;
    `;

    console.log('Manual SQL to run on database:');
    console.log(addUserColumnsSQL);

    // Create CoinTransaction table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CoinTransaction" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "source" TEXT NOT NULL,
        "description" TEXT,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoinTransaction_createdAt_idx" ON "CoinTransaction"("createdAt");`;

    // Create Badge table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Badge" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "nameFa" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "descriptionFa" TEXT NOT NULL,
        "icon" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "pointsRequired" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

    // Create UserBadge table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserBadge" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "badgeId" TEXT NOT NULL,
        "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "UserBadge_userId_badgeId_key" UNIQUE ("userId", "badgeId")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");`;

    // Create Achievement table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Achievement" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "nameFa" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "descriptionFa" TEXT NOT NULL,
        "coinsReward" INTEGER NOT NULL DEFAULT 0,
        "pointsReward" INTEGER NOT NULL DEFAULT 0,
        "icon" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

    // Create UserAchievement table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserAchievement" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "achievementId" TEXT NOT NULL,
        "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        CONSTRAINT "UserAchievement_userId_achievementId_key" UNIQUE ("userId", "achievementId")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");`;

    // Create Reward table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Reward" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "nameFa" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "descriptionFa" TEXT NOT NULL,
        "coinsCost" INTEGER NOT NULL,
        "type" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "image" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "maxRedemptions" INTEGER,
        "expiresAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

    // Create CouponRedemption table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CouponRedemption" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "rewardId" TEXT NOT NULL,
        "couponCode" TEXT NOT NULL UNIQUE,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "usedAt" TIMESTAMP(3),
        "expiresAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CouponRedemption_userId_idx" ON "CouponRedemption"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CouponRedemption_couponCode_idx" ON "CouponRedemption"("couponCode");`;

    console.log('Coin system migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateCoinSystem()
  .then(() => {
    console.log('Migration process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });


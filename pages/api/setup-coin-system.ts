import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting coin system setup...');

    // Add coin system columns to User table
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "totalCoins" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "lastLoginReward" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "totalPoints" INTEGER DEFAULT 0;
    `;

    // Create CoinTransaction table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CoinTransaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "source" TEXT NOT NULL,
        "description" TEXT,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoinTransaction_createdAt_idx" ON "CoinTransaction"("createdAt");`;

    // Create Badge table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Badge" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "nameFa" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "descriptionFa" TEXT NOT NULL,
        "icon" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "pointsRequired" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create UserBadge table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserBadge" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "badgeId" TEXT NOT NULL REFERENCES "Badge"("id") ON DELETE CASCADE,
        "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "badgeId")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");`;

    // Create Achievement table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Achievement" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "nameFa" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "descriptionFa" TEXT NOT NULL,
        "coinsReward" INTEGER NOT NULL DEFAULT 0,
        "pointsReward" INTEGER NOT NULL DEFAULT 0,
        "icon" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create UserAchievement table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserAchievement" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "achievementId" TEXT NOT NULL REFERENCES "Achievement"("id") ON DELETE CASCADE,
        "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "achievementId")
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");`;

    // Create Reward table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Reward" (
        "id" TEXT NOT NULL PRIMARY KEY,
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
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;

    // Create CouponRedemption table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CouponRedemption" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "rewardId" TEXT NOT NULL REFERENCES "Reward"("id") ON DELETE CASCADE,
        "couponCode" TEXT NOT NULL UNIQUE,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "usedAt" TIMESTAMP(3),
        "expiresAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CouponRedemption_userId_idx" ON "CouponRedemption"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CouponRedemption_couponCode_idx" ON "CouponRedemption"("couponCode");`;

    console.log('Coin system setup completed successfully!');

    return res.status(200).json({
      success: true,
      message: 'Coin system setup completed successfully!',
    });

  } catch (error) {
    console.error('Error setting up coin system:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


-- Apply Coin System Migration to Production Database
-- Run this script on your production PostgreSQL database

-- Add coin system columns to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "totalCoins" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastLoginReward" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "totalPoints" INTEGER DEFAULT 0;

-- Create CoinTransaction table
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

CREATE INDEX IF NOT EXISTS "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");
CREATE INDEX IF NOT EXISTS "CoinTransaction_createdAt_idx" ON "CoinTransaction"("createdAt");

-- Create Badge table
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

-- Create UserBadge table
CREATE TABLE IF NOT EXISTS "UserBadge" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "badgeId" TEXT NOT NULL REFERENCES "Badge"("id") ON DELETE CASCADE,
  "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "badgeId")
);

CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");

-- Create Achievement table
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

-- Create UserAchievement table
CREATE TABLE IF NOT EXISTS "UserAchievement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "achievementId" TEXT NOT NULL REFERENCES "Achievement"("id") ON DELETE CASCADE,
  "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "achievementId")
);

CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- Create Reward table
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

-- Create CouponRedemption table
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

CREATE INDEX IF NOT EXISTS "CouponRedemption_userId_idx" ON "CouponRedemption"("userId");
CREATE INDEX IF NOT EXISTS "CouponRedemption_couponCode_idx" ON "CouponRedemption"("couponCode");

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_database_user;


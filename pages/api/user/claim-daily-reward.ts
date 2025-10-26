import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ExtendedUser {
  id: string;
  totalCoins: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginReward: Date | null;
  level: number;
  totalPoints: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;

    // Get user with extended fields
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        totalCoins: true,
        currentStreak: true,
        longestStreak: true,
        lastLoginReward: true,
        level: true,
        totalPoints: true,
      }
    }) as ExtendedUser;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const lastReward = user.lastLoginReward;
    let newStreak = user.currentStreak;
    let coinsEarned = 10; // Base daily reward
    let streakMultiplier = 1;

    // Check if user claimed reward today
    if (lastReward) {
      const lastDate = new Date(lastReward);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastRewardDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

      if (lastRewardDate.getTime() === today.getTime()) {
        return res.status(400).json({ 
          error: 'Already claimed today',
          canClaimAgain: false 
        });
      }

      // Check if streak continues (claimed yesterday)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastRewardDate.getTime() === yesterday.getTime()) {
        // Continue streak
        newStreak = user.currentStreak + 1;
      } else {
        // Break streak
        newStreak = 1;
      }
    } else {
      // First time
      newStreak = 1;
    }

    // Calculate coins based on streak
    if (newStreak >= 30) {
      streakMultiplier = 3; // Triple rewards for 30+ day streaks
      coinsEarned = 30;
    } else if (newStreak >= 14) {
      streakMultiplier = 2.5;
      coinsEarned = 25;
    } else if (newStreak >= 7) {
      streakMultiplier = 2;
      coinsEarned = 20;
    }

    const totalCoins = user.totalCoins + coinsEarned;

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalCoins: totalCoins,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastLoginReward: now,
      }
    });

    // Create transaction record
    await prisma.coinTransaction.create({
      data: {
        userId: userId,
        type: 'EARNED',
        amount: coinsEarned,
        source: 'DAILY_LOGIN',
        description: `Daily login reward (${newStreak} day streak)`,
      }
    });

    // Check for badge achievements
    const badges = [];
    if (newStreak === 7) {
      badges.push('WEEK_STREAK');
    } else if (newStreak === 30) {
      badges.push('MONTH_STREAK');
    } else if (newStreak === 100) {
      badges.push('CENTURY_STREAK');
    }

    // Award badges if applicable
    for (const badgeName of badges) {
      const badge = await prisma.badge.findUnique({
        where: { name: badgeName }
      });
      
      if (badge) {
        try {
          await prisma.userBadge.create({
            data: {
              userId: userId,
              badgeId: badge.id,
            }
          });
        } catch (error) {
          // Badge already earned
        }
      }
    }

    return res.status(200).json({
      success: true,
      coinsEarned,
      totalCoins,
      streak: newStreak,
      streakMultiplier,
      badgesEarned: badges,
      canClaimAgain: false,
      nextClaimAvailable: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


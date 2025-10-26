import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;

    // Get user with coin stats
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
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if can claim daily reward
    const now = new Date();
    let canClaimToday = false;
    
    if (user.lastLoginReward) {
      const lastDate = new Date(user.lastLoginReward);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastRewardDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      canClaimToday = lastRewardDate.getTime() !== today.getTime();
    } else {
      canClaimToday = true;
    }

    // Get recent transactions
    const recentTransactions = await prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get user badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    // Get user achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return res.status(200).json({
      coins: user.totalCoins,
      streak: user.currentStreak,
      longestStreak: user.longestStreak,
      level: user.level,
      points: user.totalPoints,
      canClaimToday,
      lastLoginReward: user.lastLoginReward,
      transactions: recentTransactions,
      badges: userBadges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.nameFa,
        description: ub.badge.descriptionFa,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt,
      })),
      achievements: userAchievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.nameFa,
        description: ua.achievement.descriptionFa,
        icon: ua.achievement.icon,
        coinsReward: ua.achievement.coinsReward,
        unlockedAt: ua.unlockedAt,
      })),
    });

  } catch (error) {
    console.error('Error fetching coins:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


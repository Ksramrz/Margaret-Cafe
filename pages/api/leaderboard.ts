import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period = 'all-time', limit = '100' } = req.query;
    const limitNum = parseInt(limit as string, 10);

    let dateFilter: Date | undefined;

    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = weekAgo;
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = monthAgo;
    }

    // Get users with their stats
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        ...(dateFilter ? {
          coinTransactions: {
            some: {
              createdAt: {
                gte: dateFilter
              }
            }
          }
        } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        totalCoins: true,
        currentStreak: true,
        longestStreak: true,
        level: true,
        totalPoints: true,
        coinTransactions: {
          where: dateFilter ? {
            createdAt: {
              gte: dateFilter
            }
          } : undefined,
          select: {
            amount: true,
            type: true,
          }
        },
        userBadges: {
          select: {
            badge: {
              select: {
                icon: true,
              }
            }
          },
          take: 3,
        }
      },
      orderBy: {
        totalCoins: 'desc',
      },
      take: limitNum,
    });

    // Process the data
    const leaderboard = users.map((user, index) => {
      const recentCoins = user.coinTransactions
        .filter(t => t.type === 'EARNED')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        rank: index + 1,
        id: user.id,
        name: user.name || 'کاربر ناشناس',
        email: user.email,
        image: user.image,
        totalCoins: user.totalCoins,
        streak: user.currentStreak,
        longestStreak: user.longestStreak,
        level: user.level,
        points: user.totalPoints,
        recentCoins: dateFilter ? recentCoins : null,
        badges: user.userBadges.length,
        badgeIcons: user.userBadges.map(ub => ub.badge.icon),
      };
    });

    return res.status(200).json({
      period,
      leaderboard,
      totalUsers: await prisma.user.count({ where: { role: 'USER' } }),
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


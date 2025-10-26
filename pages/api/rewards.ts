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
    const userId = session?.user?.id;

    // Get available rewards
    const rewards = await prisma.reward.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get user's coin balance if logged in
    let userCoins = 0;
    let userRedemptions: any[] = [];
    
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalCoins: true }
      });
      
      if (user) {
        userCoins = user.totalCoins;
      }

      // Get user's redemptions
      userRedemptions = await prisma.couponRedemption.findMany({
        where: {
          userId,
          status: 'ACTIVE',
        },
        include: {
          reward: true,
        },
      });
    }

    // Add redemption info to rewards
    const rewardsWithAvailability = rewards.map(reward => {
      const redemptions = userRedemptions.filter(r => r.rewardId === reward.id);
      
      return {
        id: reward.id,
        name: reward.nameFa,
        description: reward.descriptionFa,
        coinsCost: reward.coinsCost,
        type: reward.type,
        image: reward.image,
        maxRedemptions: reward.maxRedemptions,
        expiresAt: reward.expiresAt,
        canAfford: userCoins >= reward.coinsCost,
        userCanRedeem: redemptions.length < (reward.maxRedemptions || Infinity),
      };
    });

    return res.status(200).json({
      rewards: rewardsWithAvailability,
      userCoins,
      userRedemptions: userRedemptions.length,
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


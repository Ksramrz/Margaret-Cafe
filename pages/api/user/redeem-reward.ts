import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

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
    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }

    // Get reward
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Check expiration
    if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Reward has expired' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalCoins: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has enough coins
    if (user.totalCoins < reward.coinsCost) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    // Check redemption limit
    if (reward.maxRedemptions) {
      const redemptionCount = await prisma.couponRedemption.count({
        where: { rewardId }
      });

      if (redemptionCount >= reward.maxRedemptions) {
        return res.status(400).json({ error: 'Reward redemption limit reached' });
      }
    }

    // Generate unique coupon code
    const couponCode = `CAFE-${uuidv4().toString().substr(0, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Coupon expires in 30 days

    // Start transaction
    await prisma.$transaction([
      // Update user coins
      prisma.user.update({
        where: { id: userId },
        data: {
          totalCoins: user.totalCoins - reward.coinsCost,
        }
      }),

      // Create transaction record
      prisma.coinTransaction.create({
        data: {
          userId,
          type: 'REDEEMED',
          amount: reward.coinsCost,
          source: 'REWARD_REDEMPTION',
          description: `Redeemed: ${reward.nameFa}`,
          metadata: JSON.stringify({ rewardId, couponCode }),
        }
      }),

      // Create coupon redemption
      prisma.couponRedemption.create({
        data: {
          userId,
          rewardId,
          couponCode,
          status: 'ACTIVE',
          expiresAt,
        }
      }),
    ]);

    // Parse reward value
    let rewardValue;
    try {
      rewardValue = JSON.parse(reward.value);
    } catch {
      rewardValue = { type: reward.type };
    }

    return res.status(200).json({
      success: true,
      couponCode,
      reward: {
        id: reward.id,
        name: reward.nameFa,
        type: reward.type,
        value: rewardValue,
      },
      expiresAt,
      remainingCoins: user.totalCoins - reward.coinsCost,
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


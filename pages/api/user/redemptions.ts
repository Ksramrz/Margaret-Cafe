import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
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

    const redemptions = await prisma.couponRedemption.findMany({
      where: { userId },
      include: {
        reward: {
          select: {
            name: true,
            nameFa: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      redemptions: redemptions.map((r) => ({
        id: r.id,
        couponCode: r.couponCode,
        status: r.status,
        usedAt: r.usedAt,
        expiresAt: r.expiresAt,
        createdAt: r.createdAt,
        reward: {
          name: r.reward.nameFa,
          type: r.reward.type,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


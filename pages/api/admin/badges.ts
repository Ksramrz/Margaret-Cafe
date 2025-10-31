import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all badges
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Check if badge model exists
      if (!('badge' in prisma)) {
        return res.status(200).json([]);
      }
      const badges = await (prisma as any).badge.findMany({
        orderBy: { pointsRequired: 'asc' },
      });

      return res.status(200).json(badges);
    } catch (error) {
      console.error('Error fetching badges:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Create a new badge (Admin only)
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.id || (session.user as any)?.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, nameFa, description, descriptionFa, icon, category, pointsRequired } = req.body;

      const badge = await (prisma as any).badge.create({
        data: {
          name,
          nameFa,
          description,
          descriptionFa,
          icon,
          category,
          pointsRequired: parseInt(pointsRequired) || 0,
        },
      });

      return res.status(201).json(badge);
    } catch (error) {
      console.error('Error creating badge:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


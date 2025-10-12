import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const orders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    nameFa: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(orders);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders' });
      }

    case 'PUT':
      try {
        const { id, status } = req.body;
        
        const order = await prisma.order.update({
          where: { id },
          data: { status },
        });
        
        return res.status(200).json(order);
      } catch (error) {
        return res.status(500).json({ message: 'Error updating order' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

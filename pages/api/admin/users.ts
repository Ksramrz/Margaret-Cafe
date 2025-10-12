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
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                orders: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching users' });
      }

    case 'PUT':
      try {
        const { id, role } = req.body;
        
        const user = await prisma.user.update({
          where: { id },
          data: { role },
        });
        
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: 'Error updating user' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

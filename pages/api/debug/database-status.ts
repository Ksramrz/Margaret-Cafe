import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get basic database info
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    
    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Database Status',
      summary: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
      },
      recentUsers,
      recentOrders,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Database status error:', error);
    
    return res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { table } = req.query;
    
    if (!table) {
      // Show available tables
      return res.status(200).json({
        message: 'Available Tables',
        tables: [
          { name: 'users', description: 'User accounts and profiles' },
          { name: 'products', description: 'Cafe products and menu items' },
          { name: 'orders', description: 'Customer orders and purchases' },
          { name: 'verification_codes', description: 'SMS verification codes' },
        ],
        usage: 'Add ?table=users to see user data, ?table=products for products, etc.'
      });
    }

    let data;
    let count;

    switch (table) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            emailVerified: true,
            phoneVerified: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        count = await prisma.user.count();
        break;

      case 'products':
        data = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            stock: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        count = await prisma.product.count();
        break;

      case 'orders':
        data = await prisma.order.findMany({
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
          orderBy: { createdAt: 'desc' },
        });
        count = await prisma.order.count();
        break;

      case 'verification_codes':
        data = await prisma.verificationCode.findMany({
          select: {
            id: true,
            phone: true,
            code: true,
            expiresAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        count = await prisma.verificationCode.count();
        break;

      default:
        return res.status(400).json({
          message: 'Invalid table name',
          availableTables: ['users', 'products', 'orders', 'verification_codes']
        });
    }

    return res.status(200).json({
      table: table,
      count: count,
      data: data,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Database browser error:', error);
    
    return res.status(500).json({
      message: 'Database browser failed',
      error: error.message,
    });
  }
}

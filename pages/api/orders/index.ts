import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = (session.user as any).id;
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found' });
  }

  switch (req.method) {
    case 'POST':
      return createOrder(req, res, userId);
    case 'GET':
      return getOrders(req, res, userId);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'آیتم‌های سبد خرید الزامی است' });
  }

  try {
    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد سفارش',
    });
  }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارشات',
    });
  }
}

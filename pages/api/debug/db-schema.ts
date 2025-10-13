import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Check database schema
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'User'
      ORDER BY ordinal_position
    `;

    // Test user creation
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'USER',
      },
    });

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });

    return res.status(200).json({
      message: 'Database schema check successful',
      columns,
      testUserCreated: true,
    });
  } catch (error: any) {
    console.error('Database schema check failed:', error);
    
    return res.status(500).json({
      message: 'Database schema check failed',
      error: error.message,
      code: error.code,
    });
  }
}

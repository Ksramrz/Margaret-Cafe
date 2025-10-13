import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Adding password column to User table...');
    
    // Add password column
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "password" TEXT;`;
    
    console.log('Password column added successfully!');
    
    // Test user creation
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'USER',
      } as any, // Type assertion to handle missing password field
    });

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });

    return res.status(200).json({
      message: 'Database schema updated successfully!',
      success: true,
      testUserCreated: true,
    });
  } catch (error: any) {
    console.error('Database update failed:', error);
    
    if (error.message?.includes('already exists')) {
      return res.status(200).json({
        message: 'Password column already exists',
        success: true,
      });
    }
    
    return res.status(500).json({
      message: 'Database update failed',
      error: error.message,
      code: error.code,
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number required' });
  }

  try {
    console.log(`Deleting user with phone: ${phone}`);
    
    // Delete user if exists
    const deletedUser = await prisma.user.deleteMany({
      where: { phone },
    });

    console.log(`Deleted ${deletedUser.count} users`);

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedCount: deletedUser.count,
    });
    
  } catch (error: any) {
    console.error('Delete user error:', error);
    
    return res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password required' });
  }

  try {
    console.log(`Updating password for user: ${session.user.id}`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('New password hashed, length:', hashedPassword.length);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      } as any,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    console.log('Password updated for user:', updatedUser.id);

    return res.status(200).json({
      message: 'Password updated successfully',
      user: updatedUser,
    });
    
  } catch (error: any) {
    console.error('Password update error:', error);
    
    return res.status(500).json({
      message: 'Password update failed',
      error: error.message,
    });
  }
}

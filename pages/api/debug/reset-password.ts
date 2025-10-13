import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, newPassword } = req.body;

  if (!phone || !newPassword) {
    return res.status(400).json({ message: 'Phone and new password required' });
  }

  try {
    console.log(`Resetting password for phone: ${phone}`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('New password hashed, length:', hashedPassword.length);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
      } as any,
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    console.log('Password updated for user:', updatedUser.id);

    // Test the new password
    const testUser = await prisma.user.findUnique({
      where: { phone },
    });

    const testPassword = await bcrypt.compare(newPassword, (testUser as any).password);
    console.log('Password verification test after reset:', testPassword);

    return res.status(200).json({
      message: 'Password reset successfully',
      user: updatedUser,
      passwordVerified: testPassword,
    });
    
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    return res.status(500).json({
      message: 'Password reset failed',
      error: error.message,
    });
  }
}

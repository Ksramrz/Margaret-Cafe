import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ 
      message: 'New password and confirmation are required' 
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ 
      message: 'Passwords do not match' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    console.log('Updating admin password...');
    
    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('Password hashed successfully, length:', hashedPassword.length);

    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@margaretcafe.com',
        role: 'ADMIN'
      },
    });

    if (!adminUser) {
      return res.status(404).json({ 
        message: 'Admin user not found' 
      });
    }

    // Update admin password
    const updatedAdmin = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword,
      } as any,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('Admin password updated successfully for:', updatedAdmin.email);

    // Test the new password
    const testUser = await prisma.user.findUnique({
      where: { id: adminUser.id },
    });

    const passwordTest = await bcrypt.compare(newPassword, (testUser as any).password);
    console.log('Password verification test:', passwordTest);

    return res.status(200).json({
      message: 'Admin password updated successfully!',
      success: true,
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      },
      passwordVerified: passwordTest,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Admin password update error:', error);
    
    return res.status(500).json({
      message: 'Failed to update admin password',
      error: error.message,
    });
  }
}

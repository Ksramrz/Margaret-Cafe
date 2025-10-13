import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password required' });
  }

  try {
    console.log(`Testing password verification for phone: ${phone}`);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', {
      id: user.id,
      phone: user.phone,
      hasPassword: !!(user as any).password,
      passwordLength: (user as any).password?.length || 0,
    });

    // Test password verification
    const storedPassword = (user as any).password;
    if (!storedPassword) {
      return res.status(400).json({ 
        message: 'User has no password stored',
        debug: { userExists: true, hasPassword: false }
      });
    }

    console.log('Testing bcrypt comparison...');
    console.log('Input password:', password);
    console.log('Stored hash length:', storedPassword.length);
    console.log('Stored hash starts with:', storedPassword.substring(0, 10));

    // Test bcrypt comparison
    const isValidPassword = await bcrypt.compare(password, storedPassword);
    console.log('Bcrypt comparison result:', isValidPassword);

    // Also test if we can hash the same password and compare
    const testHash = await bcrypt.hash(password, 12);
    const testComparison = await bcrypt.compare(password, testHash);
    console.log('Test hash comparison:', testComparison);

    return res.status(200).json({
      message: 'Password verification test completed',
      debug: {
        userExists: true,
        hasPassword: true,
        passwordLength: storedPassword.length,
        isValidPassword,
        testHashComparison: testComparison,
        storedHashStart: storedPassword.substring(0, 10),
      },
    });
    
  } catch (error: any) {
    console.error('Password verification test error:', error);
    
    return res.status(500).json({
      message: 'Password verification test failed',
      error: error.message,
    });
  }
}

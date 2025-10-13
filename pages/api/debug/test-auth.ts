import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { testPhone, testPassword } = req.body;

  if (!testPhone || !testPassword) {
    return res.status(400).json({ message: 'Test phone and password required' });
  }

  try {
    console.log('Testing signup and login process...');
    
    // Step 1: Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: testPhone },
    });

    if (existingUser) {
      console.log('User exists, testing login...');
      
      // Test password verification
      const isValidPassword = await bcrypt.compare(testPassword, (existingUser as any).password);
      console.log('Password valid:', isValidPassword);
      
      if (isValidPassword) {
        return res.status(200).json({
          message: 'Login test successful',
          user: {
            id: existingUser.id,
            name: existingUser.name,
            phone: existingUser.phone,
            role: existingUser.role,
            hasPassword: !!(existingUser as any).password,
          },
        });
      } else {
        return res.status(400).json({
          message: 'Password verification failed',
          debug: {
            userExists: true,
            hasPassword: !!(existingUser as any).password,
            passwordLength: (existingUser as any).password?.length || 0,
          },
        });
      }
    } else {
      // Step 2: Create test user
      console.log('Creating test user...');
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          phone: testPhone,
          password: hashedPassword,
          role: 'USER',
        } as any,
      });

      console.log('Test user created:', testUser.id);
      
      // Step 3: Test password verification
      const isValidPassword = await bcrypt.compare(testPassword, hashedPassword);
      console.log('Password verification test:', isValidPassword);
      
      // Clean up test user
      await prisma.user.delete({
        where: { id: testUser.id },
      });

      return res.status(200).json({
        message: 'Signup and login test successful',
        debug: {
          userCreated: true,
          passwordHashed: true,
          passwordVerified: isValidPassword,
        },
      });
    }
  } catch (error: any) {
    console.error('Test failed:', error);
    return res.status(500).json({
      message: 'Test failed',
      error: error.message,
      code: error.code,
    });
  }
}

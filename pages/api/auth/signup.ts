import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, password } = req.body;

  // Validate required fields
  if (!name || !password) {
    return res.status(400).json({ message: 'نام و رمز عبور الزامی است' });
  }

  if (!email && !phone) {
    return res.status(400).json({ message: 'ایمیل یا شماره تلفن الزامی است' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
  }

  try {
    // Check if user already exists
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'کاربری با این ایمیل قبلاً ثبت نام کرده است' });
      }
    }

    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingUserByPhone) {
        return res.status(400).json({ message: 'کاربری با این شماره تلفن قبلاً ثبت نام کرده است' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword, // Store hashed password
        role: 'USER', // Default role
      } as any, // Type assertion to handle missing password field
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: 'حساب کاربری با موفقیت ایجاد شد',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      debug: {
        passwordHashed: true,
        userCreated: true,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle specific database errors
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'کاربری با این اطلاعات قبلاً ثبت نام کرده است' });
    }
    
    if (error.message?.includes('password')) {
      return res.status(400).json({ message: 'خطا در رمزگذاری رمز عبور' });
    }
    
    return res.status(500).json({ 
      message: 'خطا در ایجاد حساب کاربری',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

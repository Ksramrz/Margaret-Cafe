import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: 'شماره تلفن و کد تأیید الزامی است' });
  }

  try {
    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent code
      },
    });

    if (!verificationCode) {
      return res.status(400).json({ 
        message: 'کد تأیید نامعتبر یا منقضی شده است',
        success: false 
      });
    }

    // Mark phone as verified
    await prisma.user.updateMany({
      where: { phone },
      data: { phoneVerified: new Date() },
    });

    // Delete the used verification code
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return res.status(200).json({ 
      message: 'شماره تلفن با موفقیت تأیید شد',
      success: true 
    });
  } catch (error) {
    console.error('SMS verification failed:', error);
    return res.status(500).json({ 
      message: 'خطا در تأیید کد',
      success: false 
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationCode, generateVerificationCode } from '@/lib/sms';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'شماره تلفن الزامی است' });
  }

  try {
    const code = generateVerificationCode();
    
    // ذخیره کد در دیتابیس
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 دقیقه
      },
    });

    // ارسال SMS
    await sendVerificationCode(phone, code);

    return res.status(200).json({ 
      message: 'کد تأیید ارسال شد',
      success: true 
    });
  } catch (error) {
    console.error('SMS sending failed:', error);
    return res.status(500).json({ 
      message: 'خطا در ارسال کد تأیید',
      success: false 
    });
  }
}




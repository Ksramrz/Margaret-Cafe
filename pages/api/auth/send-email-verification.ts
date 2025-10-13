import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, email } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'شماره تلفن الزامی است' });
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send email instead of SMS
    if (email) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'کد تأیید کافه مارگارت',
        html: `
          <div style="font-family: Tahoma; direction: rtl; text-align: center;">
            <h2>کد تأیید کافه مارگارت</h2>
            <p>کد تأیید شما: <strong style="font-size: 24px; color: #16a34a;">${code}</strong></p>
            <p>این کد تا 5 دقیقه معتبر است.</p>
            <p>شماره تلفن: ${phone}</p>
          </div>
        `,
      });
    }

    return res.status(200).json({ 
      message: email ? 'کد تأیید به ایمیل ارسال شد' : 'کد تأیید تولید شد',
      success: true,
      code: code, // For testing purposes - remove in production
    });
  } catch (error) {
    console.error('Email verification failed:', error);
    return res.status(500).json({ 
      message: 'خطا در ارسال کد تأیید',
      success: false 
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentRequest } from '@/lib/zarinpal';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { amount, description, orderId } = req.body;

  if (!amount || !description) {
    return res.status(400).json({ message: 'مبلغ و توضیحات الزامی است' });
  }

  try {
    const callbackUrl = `${process.env.NEXTAUTH_URL}/payment/callback`;
    const paymentResult = await createPaymentRequest(amount, description, callbackUrl);

    if (paymentResult.success) {
      // ذخیره اطلاعات پرداخت در دیتابیس
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentId: paymentResult.authority,
            status: 'PENDING',
          },
        });
      }

      return res.status(200).json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        authority: paymentResult.authority
      });
    } else {
      return res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }
  } catch (error) {
    console.error('Payment creation failed:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد پرداخت'
    });
  }
}




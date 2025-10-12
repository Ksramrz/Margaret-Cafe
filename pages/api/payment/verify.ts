import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPayment } from '@/lib/zarinpal';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { Authority, Status, Amount } = req.body;

  if (!Authority || Status !== 'OK' || !Amount) {
    return res.status(400).json({ message: 'Invalid payment verification parameters.' });
  }

  try {
    const verificationResult = await verifyPayment(Authority, Amount);

    if (verificationResult.success) {
      // Update order status in database
      await prisma.order.updateMany({
        where: { paymentId: Authority },
        data: { 
          status: 'PAID',
          paymentId: verificationResult.refId 
        },
      });

      return res.status(200).json({ 
        success: true, 
        message: verificationResult.message, 
        RefID: verificationResult.refId 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: verificationResult.message 
      });
    }
  } catch (error: any) {
    console.error('Error verifying Zarinpal payment:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify Zarinpal payment.' 
    });
  }
}
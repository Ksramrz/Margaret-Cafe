import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationCode, generateVerificationCode } from '@/lib/sms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'شماره تلفن الزامی است' });
  }

  // Debug environment variables
  const envCheck = {
    hasApiKey: !!process.env.KAVENEGAR_API_KEY,
    hasSenderNumber: !!process.env.KAVENEGAR_SENDER_NUMBER,
    apiKeyLength: process.env.KAVENEGAR_API_KEY?.length || 0,
    senderNumber: process.env.KAVENEGAR_SENDER_NUMBER,
    nodeEnv: process.env.NODE_ENV,
  };

  console.log('Environment check:', envCheck);

  try {
    const code = generateVerificationCode();
    console.log(`Generated code: ${code} for phone: ${phone}`);
    
    // Test SMS sending with detailed error handling
    const result = await sendVerificationCode(phone, code);
    
    return res.status(200).json({ 
      message: 'کد تأیید ارسال شد',
      success: true,
      debug: {
        envCheck,
        code,
        result
      }
    });
  } catch (error: any) {
    console.error('SMS sending failed:', error);
    return res.status(500).json({ 
      message: 'خطا در ارسال کد تأیید',
      success: false,
      error: error.message,
      debug: {
        envCheck,
        errorType: error.constructor.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}

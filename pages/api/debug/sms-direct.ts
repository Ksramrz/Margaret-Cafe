import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'شماره تلفن الزامی است' });
  }

  // Check environment variables
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const senderNumber = process.env.KAVENEGAR_SENDER_NUMBER;

  if (!apiKey || !senderNumber) {
    return res.status(500).json({
      message: 'SMS configuration missing',
      debug: {
        hasApiKey: !!apiKey,
        hasSenderNumber: !!senderNumber,
        apiKeyLength: apiKey?.length || 0,
        senderNumber: senderNumber
      }
    });
  }

  try {
    // Direct Kavenegar test
    const Kavenegar = require('kavenegar');
    const api = Kavenegar.KavenegarApi({ apikey: apiKey });

    const testCode = '123456';
    
    return new Promise((resolve) => {
      api.Send({
        message: `تست کافه مارگارت - کد: ${testCode}`,
        sender: senderNumber,
        receptor: phone,
      }, (response: any, status: number) => {
        console.log('Direct SMS test result:', { response, status });
        
        if (status === 200) {
          resolve(res.status(200).json({
            message: 'SMS sent successfully',
            success: true,
            debug: {
              status,
              response,
              phone,
              senderNumber
            }
          }));
        } else {
          resolve(res.status(500).json({
            message: 'SMS failed',
            success: false,
            debug: {
              status,
              response,
              phone,
              senderNumber,
              error: `Status ${status}`
            }
          }));
        }
      });
    });

  } catch (error: any) {
    console.error('Direct SMS test failed:', error);
    return res.status(500).json({
      message: 'SMS test failed',
      success: false,
      error: error.message,
      debug: {
        errorType: error.constructor.name,
        phone,
        senderNumber
      }
    });
  }
}

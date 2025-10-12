import { NextApiRequest, NextApiResponse } from 'next';

// تنظیمات زرین‌پال
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const ZARINPAL_SANDBOX = process.env.NODE_ENV === 'development';

const ZARINPAL_API_URL = ZARINPAL_SANDBOX 
  ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json'
  : 'https://api.zarinpal.com/pg/v4/payment/request.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, description, callback_url } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ message: 'مبلغ و توضیحات الزامی است' });
    }

    // درخواست پرداخت به زرین‌پال
    const paymentRequest = {
      merchant_id: ZARINPAL_MERCHANT_ID,
      amount: amount, // مبلغ به ریال
      description: description,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      mobile: '', // اختیاری
      email: '', // اختیاری
    };

    const response = await fetch(ZARINPAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    const data = await response.json();

    if (data.data && data.data.code === 100) {
      // موفقیت‌آمیز
      const paymentUrl = ZARINPAL_SANDBOX
        ? `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`
        : `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;

      return res.status(200).json({
        success: true,
        authority: data.data.authority,
        payment_url: paymentUrl,
      });
    } else {
      // خطا
      return res.status(400).json({
        success: false,
        message: 'خطا در ایجاد درخواست پرداخت',
        error_code: data.data?.code,
      });
    }
  } catch (error) {
    console.error('Zarinpal payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ارتباط با زرین‌پال',
    });
  }
}


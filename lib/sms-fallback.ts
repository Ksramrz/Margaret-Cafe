// Alternative SMS provider using SMS.ir
// This can be used as a fallback if Kavenegar has restrictions

export const sendSmsViaSmsIr = async (phone: string, code: string) => {
  const SMS_IR_API_KEY = process.env.SMS_IR_API_KEY;
  const SMS_IR_SENDER_NUMBER = process.env.SMS_IR_SENDER_NUMBER;

  if (!SMS_IR_API_KEY || !SMS_IR_SENDER_NUMBER) {
    throw new Error('SMS.ir credentials not configured');
  }

  try {
    const response = await fetch('https://api.sms.ir/v1/send/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SMS_IR_API_KEY,
      },
      body: JSON.stringify({
        mobile: phone,
        templateId: 100000, // You need to create a template in SMS.ir
        parameters: [
          {
            name: 'code',
            value: code,
          },
        ],
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      return result;
    } else {
      throw new Error(`SMS.ir error: ${result.message}`);
    }
  } catch (error) {
    console.error('SMS.ir sending failed:', error);
    throw error;
  }
};

// Fallback SMS function that tries multiple providers
export const sendVerificationCodeWithFallback = async (phone: string, code: string) => {
  // Try Kavenegar first
  try {
    const { sendVerificationCode } = await import('./sms');
    return await sendVerificationCode(phone, code);
  } catch (kavenegarError: any) {
    console.warn('Kavenegar failed, trying SMS.ir:', kavenegarError.message);
    
    // Try SMS.ir as fallback
    try {
      return await sendSmsViaSmsIr(phone, code);
    } catch (smsIrError) {
      console.error('Both SMS providers failed:', { kavenegarError, smsIrError });
      throw new Error('All SMS providers failed');
    }
  }
};

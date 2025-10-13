// SMS helper using Kavenegar Iranian SMS provider

let Kavenegar: any;
let api: any;

// Initialize Kavenegar API if credentials are available
if (process.env.KAVENEGAR_API_KEY) {
  try {
    Kavenegar = require('kavenegar');
    api = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY,
    });
  } catch (e) {
    console.warn("Kavenegar API key is set, but 'kavenegar' module is not installed. SMS functionality will be disabled.");
    Kavenegar = null;
    api = null;
  }
} else {
  console.warn("KAVENEGAR_API_KEY is not set. SMS functionality will be disabled.");
}

export const sendVerificationCode = async (phone: string, code: string) => {
  if (!api) {
    console.warn('SMS API is not initialized. Skipping sending verification code.');
    return { disabled: true };
  }

  return new Promise((resolve, reject) => {
    console.log(`Sending SMS to ${phone} with code ${code}`);
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      reject(new Error('SMS request timeout'));
    }, 30000); // 30 second timeout
    
    api.Send({
      message: `کد تأیید شما: ${code}`,
      sender: process.env.KAVENEGAR_SENDER_NUMBER,
      receptor: phone,
    }, (response: any, status: number) => {
      clearTimeout(timeout);
      
      console.log('SMS Response:', response);
      console.log('SMS Status:', status);
      
      if (status === 200 && response && response.length > 0) {
        const smsResult = response[0];
        console.log('SMS sent successfully:', {
          messageId: smsResult.messageid,
          status: smsResult.status,
          statusText: smsResult.statustext,
          cost: smsResult.cost
        });
        resolve(smsResult);
      } else {
        console.error('SMS sending failed:', { response, status });
        reject(new Error(`SMS failed with status ${status}`));
      }
    });
  });
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};




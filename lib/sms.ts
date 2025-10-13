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

  try {
    const result = await api.Send({
      message: `کد تأیید شما: ${code}`,
      sender: process.env.KAVENEGAR_SENDER_NUMBER,
      receptor: phone,
    });
    return result;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};




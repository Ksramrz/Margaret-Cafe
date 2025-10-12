import Kavenegar from 'kavenegar';

const api = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API_KEY!,
});

export const sendVerificationCode = async (phone: string, code: string) => {
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




// Optional SMS helper. Lazily loads Kavenegar only when configured.

export const sendVerificationCode = async (phone: string, code: string) => {
  if (!process.env.KAVENEGAR_API_KEY) {
    // SMS not configured; no-op to avoid build/runtime failures in environments without the SDK/key
    console.warn('Kavenegar disabled: KAVENEGAR_API_KEY is not set. Skipping SMS send.');
    return { disabled: true } as any;
  }

  // Lazy import to avoid build-time dependency requirement
  const kavenegar: any = (await import('kavenegar' as any)).default ?? (await import('kavenegar' as any));
  const api = kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY,
  });

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




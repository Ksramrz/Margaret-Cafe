import axios from 'axios';

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const SANDBOX = process.env.ZARINPAL_SANDBOX === 'true';

const baseURL = SANDBOX 
  ? 'https://sandbox.zarinpal.com/pg/rest/WebGate'
  : 'https://api.zarinpal.com/pg/v4/payment';

export const createPaymentRequest = async (amount: number, description: string, callbackUrl: string) => {
  try {
    const response = await axios.post(`${baseURL}/request.json`, {
      merchant_id: MERCHANT_ID,
      amount: amount,
      description: description,
      callback_url: callbackUrl,
    });

    if (response.data.data.code === 100) {
      return {
        success: true,
        authority: response.data.data.authority,
        paymentUrl: SANDBOX 
          ? `https://sandbox.zarinpal.com/pg/StartPay/${response.data.data.authority}`
          : `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`
      };
    } else {
      return {
        success: false,
        message: 'خطا در ایجاد درخواست پرداخت'
      };
    }
  } catch (error) {
    console.error('Payment request failed:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با درگاه پرداخت'
    };
  }
};

export const verifyPayment = async (authority: string, amount: number) => {
  try {
    const response = await axios.post(`${baseURL}/verify.json`, {
      merchant_id: MERCHANT_ID,
      amount: amount,
      authority: authority,
    });

    if (response.data.data.code === 100) {
      return {
        success: true,
        refId: response.data.data.ref_id,
        message: 'پرداخت با موفقیت انجام شد'
      };
    } else {
      return {
        success: false,
        message: 'پرداخت ناموفق'
      };
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      message: 'خطا در تأیید پرداخت'
    };
  }
};




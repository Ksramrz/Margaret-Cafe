# راهنمای کامل راه‌اندازی سیستم‌های احراز هویت و پرداخت

## 🔐 راه‌اندازی Google OAuth

### مرحله 1: ایجاد پروژه در Google Cloud Console

1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
3. در منوی سمت چپ، "APIs & Services" > "Credentials" را انتخاب کنید
4. روی "Create Credentials" کلیک کنید و "OAuth client ID" را انتخاب کنید

### مرحله 2: تنظیم OAuth Consent Screen

1. در همان صفحه، "OAuth consent screen" را انتخاب کنید
2. نوع "External" را انتخاب کنید
3. اطلاعات زیر را پر کنید:
   - **App name**: Margaret Café
   - **User support email**: admin@margaretcafe.com
   - **Developer contact information**: admin@margaretcafe.com

### مرحله 3: ایجاد OAuth Client ID

1. "Create Credentials" > "OAuth client ID" را انتخاب کنید
2. Application type: "Web application" را انتخاب کنید
3. نام مناسب برای کلاینت انتخاب کنید
4. در بخش "Authorized redirect URIs" آدرس زیر را اضافه کنید:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   برای production:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

### مرحله 4: تنظیم متغیرهای محیطی

فایل `.env` را به‌روزرسانی کنید:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_very_secret_key_here
```

---

## 📱 راه‌اندازی SMS Verification

### مرحله 1: انتخاب سرویس SMS

برای ایران، سرویس‌های زیر پیشنهاد می‌شود:
- **Kavenegar** (کاوه‌نگار)
- **SMS.ir**
- **Melipayamak**

### مرحله 2: راه‌اندازی Kavenegar (پیشنهادی)

1. به [Kavenegar](https://kavenegar.com/) بروید و ثبت‌نام کنید
2. API Key خود را از پنل کاربری دریافت کنید
3. شماره فرستنده را تنظیم کنید

### مرحله 3: نصب پکیج

```bash
npm install kavenegar
```

### مرحله 4: ایجاد سرویس SMS

فایل `lib/sms.ts` را ایجاد کنید:

```typescript
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
```

### مرحله 5: ایجاد API Route برای SMS

فایل `pages/api/auth/send-sms.ts` را ایجاد کنید:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationCode, generateVerificationCode } from '@/lib/sms';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'شماره تلفن الزامی است' });
  }

  try {
    const code = generateVerificationCode();
    
    // ذخیره کد در دیتابیس (اختیاری)
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 دقیقه
      },
    });

    // ارسال SMS
    await sendVerificationCode(phone, code);

    return res.status(200).json({ 
      message: 'کد تأیید ارسال شد',
      success: true 
    });
  } catch (error) {
    console.error('SMS sending failed:', error);
    return res.status(500).json({ 
      message: 'خطا در ارسال کد تأیید',
      success: false 
    });
  }
}
```

### مرحله 6: تنظیم متغیرهای محیطی

```env
# SMS Configuration
KAVENEGAR_API_KEY=your_kavenegar_api_key
KAVENEGAR_SENDER_NUMBER=10008663
```

---

## 💳 راه‌اندازی Zarinpal Payment Gateway

### مرحله 1: ثبت‌نام در Zarinpal

1. به [Zarinpal](https://zarinpal.com/) بروید
2. حساب کاربری ایجاد کنید
3. اطلاعات کسب‌وکار را تکمیل کنید
4. Merchant ID خود را دریافت کنید

### مرحله 2: نصب پکیج

```bash
npm install axios
```

### مرحله 3: ایجاد سرویس پرداخت

فایل `lib/zarinpal.ts` را ایجاد کنید:

```typescript
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
```

### مرحله 4: ایجاد API Routes

فایل `pages/api/payment/create.ts` را ایجاد کنید:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentRequest } from '@/lib/zarinpal';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { amount, description, orderId } = req.body;

  if (!amount || !description) {
    return res.status(400).json({ message: 'مبلغ و توضیحات الزامی است' });
  }

  try {
    const callbackUrl = `${process.env.NEXTAUTH_URL}/payment/callback`;
    const paymentResult = await createPaymentRequest(amount, description, callbackUrl);

    if (paymentResult.success) {
      // ذخیره اطلاعات پرداخت در دیتابیس
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentId: paymentResult.authority,
          status: 'PENDING',
        },
      });

      return res.status(200).json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        authority: paymentResult.authority
      });
    } else {
      return res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }
  } catch (error) {
    console.error('Payment creation failed:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد پرداخت'
    });
  }
}
```

### مرحله 5: تنظیم متغیرهای محیطی

```env
# Zarinpal Configuration
ZARINPAL_MERCHANT_ID=your_merchant_id_here
ZARINPAL_SANDBOX=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🚀 راه‌اندازی کامل

### مرحله 1: نصب پکیج‌های مورد نیاز

```bash
npm install kavenegar axios
```

### مرحله 2: به‌روزرسانی Prisma Schema

فایل `prisma/schema.prisma` را به‌روزرسانی کنید:

```prisma
model VerificationCode {
  id        String   @id @default(cuid())
  phone     String
  code      String
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@map("verification_codes")
}
```

### مرحله 3: اجرای Migration

```bash
npx prisma db push
```

### مرحله 4: تست سیستم

1. **تست Google OAuth**: روی دکمه "ورود با Google" کلیک کنید
2. **تست SMS**: شماره تلفن وارد کنید و کد تأیید را دریافت کنید
3. **تست Zarinpal**: محصولی را خریداری کنید و پرداخت را تست کنید

---

## 🔧 تنظیمات Production

### متغیرهای محیطی Production

```env
# Production Environment
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret_key

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# SMS (Production)
KAVENEGAR_API_KEY=your_production_kavenegar_key
KAVENEGAR_SENDER_NUMBER=your_production_sender_number

# Zarinpal (Production)
ZARINPAL_MERCHANT_ID=your_production_merchant_id
ZARINPAL_SANDBOX=false
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### تنظیمات Google OAuth برای Production

1. در Google Cloud Console، redirect URI زیر را اضافه کنید:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. OAuth consent screen را برای production تنظیم کنید

---

## 📞 پشتیبانی

در صورت بروز مشکل:
- **Google OAuth**: [مستندات رسمی](https://developers.google.com/identity/protocols/oauth2)
- **Kavenegar**: [مستندات API](https://kavenegar.com/rest.html)
- **Zarinpal**: [مستندات درگاه](https://docs.zarinpal.com/)

---

## ✅ چک‌لیست نهایی

- [ ] Google OAuth راه‌اندازی شده
- [ ] SMS verification فعال است
- [ ] Zarinpal payment gateway متصل است
- [ ] تمام متغیرهای محیطی تنظیم شده
- [ ] دیتابیس به‌روزرسانی شده
- [ ] تست‌های اولیه انجام شده
- [ ] تنظیمات production آماده است




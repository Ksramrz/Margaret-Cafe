# SMS Configuration Guide for Margaret Café

## Iranian SMS Provider Setup (Kavenegar)

### 1. Get Kavenegar Account
- Visit [Kavenegar.com](https://kavenegar.com)
- Register for an account
- Verify your account and add credit

### 2. Get API Credentials
- Login to your Kavenegar dashboard
- Go to "API Keys" section
- Copy your API key
- Get your sender number (must be verified)

### 3. Environment Variables
Add these to your `.env.local` file:

```env
# Kavenegar SMS Configuration
KAVENEGAR_API_KEY=your_api_key_here
KAVENEGAR_SENDER_NUMBER=your_verified_number_here
```

### 4. For Render Deployment
Add these environment variables in Render dashboard:
- `KAVENEGAR_API_KEY`: Your Kavenegar API key
- `KAVENEGAR_SENDER_NUMBER`: Your verified sender number

### 5. Phone Number Format
- Use Iranian format: `09123456789`
- Include country code: `+989123456789`
- Both formats are supported

### 6. SMS Features
- ✅ **Signup with phone** - SMS verification required
- ✅ **6-digit verification codes** - 5-minute expiry
- ✅ **Resend functionality** - Users can request new codes
- ✅ **Persian SMS messages** - "کد تأیید شما: 123456"

### 7. Testing
- Use test phone numbers provided by Kavenegar
- Check SMS delivery in Kavenegar dashboard
- Monitor API usage and costs

### 8. Cost Information
- SMS cost: ~200-300 Toman per message
- Free test credits usually provided
- Check Kavenegar pricing for current rates

### 9. Alternative Providers
If you prefer other Iranian SMS providers:
- **SMS.ir** - Another popular option
- **FarazSMS** - Enterprise solution
- **RayganSMS** - Budget option

Update the `lib/sms.ts` file to use different provider APIs if needed.

### 10. Troubleshooting
- **SMS not sending**: Check API key and sender number
- **Invalid number**: Ensure correct Iranian format
- **Rate limiting**: Kavenegar has daily limits
- **Credit issues**: Add more credit to account

## Current Implementation Status
- ✅ SMS sending API (`/api/auth/send-sms`)
- ✅ SMS verification API (`/api/auth/verify-sms`)
- ✅ Phone signup flow with verification
- ✅ Database storage for verification codes
- ✅ Persian SMS messages
- ✅ Resend functionality
- ✅ 5-minute code expiry

## Usage Flow
1. User enters phone number
2. Clicks "ارسال کد تأیید" (Send verification code)
3. SMS sent via Kavenegar
4. User enters 6-digit code
5. Clicks "تأیید کد و ایجاد حساب" (Verify code and create account)
6. Account created with verified phone number

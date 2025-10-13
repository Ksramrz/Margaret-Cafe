import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);
  
  const router = useRouter();

  const sendSmsCode = async () => {
    if (!phone) {
      setError('لطفاً شماره تلفن را وارد کنید');
      return;
    }

    setIsVerifyingSms(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSmsSent(true);
        setError('');
      } else {
        setError(data.message || 'خطا در ارسال کد تأیید');
      }
    } catch (error) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsVerifyingSms(false);
    }
  };

  const verifySmsCode = async () => {
    if (!smsCode) {
      setError('لطفاً کد تأیید را وارد کنید');
      return;
    }

    setIsVerifyingSms(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code: smsCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        // SMS verified, now proceed with signup
        await handleSignup();
      } else {
        setError(data.message || 'کد تأیید نامعتبر است');
      }
    } catch (error) {
      console.error('SMS verification error:', error);
      setError('خطا در تأیید کد');
    } finally {
      setIsVerifyingSms(false);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to signin with success message
        router.push('/auth/signin?message=حساب کاربری با موفقیت ایجاد شد. لطفاً وارد شوید.');
      } else {
        setError(data.message || 'خطا در ایجاد حساب کاربری');
      }
    } catch (error) {
      setError('خطا در برقراری ارتباط با سرور');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('رمزهای عبور مطابقت ندارند');
      setIsLoading(false);
      return;
    }

    if (authMethod === 'phone') {
      if (!smsSent) {
        // First step: send SMS code
        await sendSmsCode();
        setIsLoading(false);
        return;
      } else {
        // Second step: verify SMS code
        await verifySmsCode();
        setIsLoading(false);
        return;
      }
    } else {
      // Email signup - direct signup
      await handleSignup();
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      setError('ثبت نام با گوگل ناموفق بود');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">ایجاد حساب کاربری</h2>
          <p className="mt-2 text-gray-600">به خانواده کافه مارگارت بپیوندید</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Auth Method Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'email'
                  ? 'bg-white text-cafe-green shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ایمیل
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'phone'
                  ? 'bg-white text-cafe-green shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              شماره تلفن
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                نام کامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                  placeholder="نام و نام خانوادگی"
                  required
                />
              </div>
            </div>

            {authMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس ایمیل
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                    placeholder="09123456789"
                    required
                    disabled={smsSent}
                  />
                </div>
                
                {smsSent && (
                  <div className="mt-4">
                    <label htmlFor="smsCode" className="block text-sm font-medium text-gray-700 mb-2">
                      کد تأیید ارسال شده
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="smsCode"
                        type="text"
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                        placeholder="کد 6 رقمی"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={sendSmsCode}
                        disabled={isVerifyingSms}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        ارسال مجدد
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      کد تأیید به شماره {phone} ارسال شد
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأیید رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                  placeholder="رمز عبور را مجدداً وارد کنید"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isVerifyingSms}
              className="w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isVerifyingSms 
                ? (authMethod === 'phone' && !smsSent 
                    ? 'در حال ارسال کد...' 
                    : authMethod === 'phone' && smsSent 
                    ? 'در حال تأیید کد...' 
                    : 'در حال ایجاد حساب...')
                : authMethod === 'phone' && !smsSent 
                ? 'ارسال کد تأیید'
                : authMethod === 'phone' && smsSent 
                ? 'تأیید کد و ایجاد حساب'
                : 'ایجاد حساب کاربری'
              }
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">یا</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              ثبت نام با گوگل
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              قبلاً حساب کاربری دارید؟{' '}
              <Link href="/auth/signin" className="text-cafe-green hover:text-green-700 font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fa', ['common'])),
    },
  };
};

export default SignUp;
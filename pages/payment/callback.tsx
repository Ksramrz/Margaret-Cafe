import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PaymentCallbackProps {
  Authority: string;
  Status: string;
  Amount?: string;
}

const PaymentCallbackPage: React.FC<PaymentCallbackProps> = ({ Authority, Status, Amount }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [refId, setRefId] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Authority,
            Status,
            Amount: Amount || '0',
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPaymentStatus('success');
          setMessage(result.message || 'پرداخت با موفقیت انجام شد');
          setRefId(result.RefID || '');
        } else {
          setPaymentStatus('error');
          setMessage(result.message || 'پرداخت ناموفق بود');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('error');
        setMessage('خطا در تأیید پرداخت');
      }
    };

    if (Authority && Status) {
      verifyPayment();
    } else {
      setPaymentStatus('error');
      setMessage('پارامترهای پرداخت نامعتبر است');
    }
  }, [Authority, Status, Amount]);

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('fa-IR');
  };

  return (
    <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card text-center"
          >
            {paymentStatus === 'loading' && (
              <>
                <div className="mb-6">
                  <Loader className="w-16 h-16 text-cafe-green mx-auto animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  در حال تأیید پرداخت...
                </h1>
                <p className="text-gray-600">
                  لطفاً صبر کنید تا پرداخت شما تأیید شود
                </p>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  پرداخت موفق!
                </h1>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                
                {Amount && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-800 mb-2">مبلغ پرداخت شده:</p>
                    <p className="text-xl font-bold text-green-900">
                      {formatPrice(Amount)} تومان
                    </p>
                  </div>
                )}

                {refId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 mb-2">شماره پیگیری:</p>
                    <p className="text-lg font-bold text-blue-900 font-mono">
                      {refId}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <Link
                    href="/orders"
                    className="block w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    مشاهده سفارشات
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    بازگشت به فروشگاه
                  </Link>
                </div>
              </>
            )}

            {paymentStatus === 'error' && (
              <>
                <div className="mb-6">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  پرداخت ناموفق
                </h1>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>

                <div className="space-y-4">
                  <Link
                    href="/checkout"
                    className="block w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    تلاش مجدد
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    بازگشت به فروشگاه
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Authority, Status, Amount } = context.query;

  return {
    props: {
      Authority: Authority || '',
      Status: Status || '',
      Amount: Amount || '',
      ...(await serverSideTranslations(context.locale ?? 'fa', ['common'])),
    },
  };
};

export default PaymentCallbackPage;
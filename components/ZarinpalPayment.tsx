import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZarinpalPayment: React.FC<PaymentFormProps> = ({ amount, description, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('zarinpal');

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // در اینجا باید با API زرین‌پال ارتباط برقرار کنید
      const response = await fetch('/api/payment/zarinpal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 10, // تبدیل به ریال
          description,
          callback_url: `${window.location.origin}/payment/callback`,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // هدایت به صفحه پرداخت زرین‌پال
        window.location.href = data.payment_url;
      } else {
        onError(data.message || 'خطا در ایجاد درخواست پرداخت');
      }
    } catch (error) {
      onError('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">پرداخت امن</h3>
        <p className="text-gray-600">مبلغ: {amount.toLocaleString('fa-IR')} تومان</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">توضیحات:</span>
          </div>
          <p className="text-sm text-gray-800">{description}</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="zarinpal"
              name="payment"
              value="zarinpal"
              checked={paymentMethod === 'zarinpal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="zarinpal" className="flex items-center">
              <img 
                src="/images/zarinpal-logo.png" 
                alt="زرین‌پال" 
                className="w-6 h-6 mr-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-sm font-medium">زرین‌پال</span>
            </label>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Shield className="w-3 h-3 mr-1" />
            پرداخت امن و سریع
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center text-sm text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>پرداخت شما توسط زرین‌پال محافظت می‌شود</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              در حال پردازش...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              پرداخت با زرین‌پال
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            با کلیک بر روی دکمه پرداخت، شما با قوانین و مقررات موافقت می‌کنید
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZarinpalPayment;


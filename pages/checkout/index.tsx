import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CreditCard, ShoppingCart, User, MapPin, Phone, Mail, ArrowRight, CheckCircle, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { state: cart, clearCart, updateQuantity, removeItem } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    if (cart.items.length === 0) {
      setError('سبد خرید شما خالی است');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'خطا در ایجاد سفارش');
      }

      // Create payment
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cart.total,
          description: `پرداخت سفارش ${orderResult.order.id}`,
          orderId: orderResult.order.id,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        // Clear cart
        clearCart();
        // Redirect to Zarinpal payment page
        window.location.href = paymentResult.paymentUrl;
      } else {
        throw new Error(paymentResult.message || 'خطا در ایجاد پرداخت');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'خطا در پردازش سفارش');
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cafe-green mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h1>
          <p className="text-gray-600 mb-8">لطفاً ابتدا محصولاتی به سبد خرید خود اضافه کنید</p>
          <Link
            href="/shop"
            className="bg-cafe-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-cream">
      {/* Header */}
      <section className="bg-cafe-green text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              تکمیل خرید
            </h1>
            <p className="text-xl text-green-200">
              اطلاعات خود را تکمیل کنید و سفارش خود را نهایی کنید
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 ml-2" />
                اطلاعات شخصی
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline ml-1" />
                    ایمیل
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline ml-1" />
                    شماره تلفن
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline ml-1" />
                    آدرس
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شهر
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    یادداشت (اختیاری)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      پرداخت با زرین‌پال
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingCart className="w-6 h-6 ml-2" />
                خلاصه سفارش
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0] || '/images/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded border text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                            aria-label="decrement"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded border text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                            aria-label="increment"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-3 text-red-600 hover:text-red-700 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)} تومان
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">تعداد آیتم‌ها:</span>
                  <span className="font-medium">{cart.itemCount}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">مجموع:</span>
                  <span className="text-xl font-bold text-cafe-green">
                    {formatPrice(cart.total)} تومان
                  </span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">پرداخت امن با زرین‌پال</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    اطلاعات پرداخت شما کاملاً محفوظ و امن است
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
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

export default CheckoutPage;

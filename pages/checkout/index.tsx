import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CreditCard, ShoppingCart, User, MapPin, Phone, Mail, ArrowRight, CheckCircle, Minus, Plus, Trash2, Coffee } from 'lucide-react';
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
        clearCart();
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cafe-green border-t-transparent mx-auto mb-4"></div>
          <p className="mt-4 text-xl text-cafe-charcoal-light font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-cafe-charcoal mb-4">سبد خرید شما خالی است</h1>
          <p className="text-lg text-cafe-charcoal-light mb-8">لطفاً ابتدا محصولاتی به سبد خرید خود اضافه کنید</p>
          <Link
            href="/shop"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            <Coffee className="w-5 h-5" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-cafe-green text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full mb-6">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">تکمیل سفارش</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              تکمیل خرید
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              اطلاعات خود را تکمیل کنید و سفارش خود را نهایی کنید
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-bold text-cafe-charcoal mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-cafe-green rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  اطلاعات شخصی
                </h2>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-cafe-charcoal mb-2">
                        نام
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cafe-charcoal mb-2">
                        نام خانوادگی
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                        placeholder="نام خانوادگی خود را وارد کنید"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cafe-charcoal mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      ایمیل
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cafe-charcoal mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                      placeholder="09123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cafe-charcoal mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      آدرس کامل
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all resize-none"
                      placeholder="آدرس کامل خود را وارد کنید"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-cafe-charcoal mb-2">
                        شهر
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                        placeholder="شهر محل سکونت"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cafe-charcoal mb-2">
                        کد پستی
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cafe-charcoal mb-2">
                      یادداشت (اختیاری)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all resize-none"
                      placeholder="هر گونه یادداشت یا درخواست خاص"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-cafe-green hover:bg-cafe-green-dark text-white py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-md hover:shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        پرداخت با زرین‌پال
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-2xl font-bold text-cafe-charcoal mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  خلاصه سفارش
                </h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <img
                        src={item.images[0] || '/images/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-cafe-charcoal mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-cafe-green hover:text-white hover:border-cafe-green transition-all flex items-center justify-center"
                            aria-label="decrement"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-cafe-green hover:text-white hover:border-cafe-green transition-all flex items-center justify-center"
                            aria-label="increment"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-cafe-charcoal-light">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-cafe-charcoal text-lg">
                          {formatPrice(item.price * item.quantity)} تومان
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cafe-charcoal-light font-medium">تعداد آیتم‌ها:</span>
                    <span className="font-bold text-cafe-charcoal">{cart.itemCount} عدد</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-cafe-charcoal">مجموع:</span>
                    <span className="text-2xl font-bold text-cafe-green">
                      {formatPrice(cart.total)} تومان
                    </span>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-3 text-green-800 mb-2">
                      <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      <span className="font-bold">پرداخت امن با زرین‌پال</span>
                    </div>
                    <p className="text-sm text-green-700">
                      اطلاعات پرداخت شما کاملاً محفوظ و امن است
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

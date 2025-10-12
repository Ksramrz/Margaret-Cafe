import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    nameFa: string;
    image: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  paymentId: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/orders');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();

      if (result.success) {
        setOrders(result.orders);
      } else {
        setError(result.message || 'خطا در دریافت سفارشات');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('خطا در دریافت سفارشات');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          text: 'در انتظار پرداخت',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      case 'PAID':
        return {
          icon: CheckCircle,
          text: 'پرداخت شده',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'SHIPPED':
        return {
          icon: Truck,
          text: 'ارسال شده',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'DELIVERED':
        return {
          icon: Package,
          text: 'تحویل داده شده',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          text: 'لغو شده',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      default:
        return {
          icon: Clock,
          text: status,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cafe-green mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطا</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-cafe-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            تلاش مجدد
          </button>
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
              سفارشات من
            </h1>
            <p className="text-xl text-green-200">
              تاریخچه سفارشات و وضعیت آن‌ها
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center"
            >
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                هیچ سفارشی ندارید
              </h2>
              <p className="text-gray-600 mb-8">
                هنوز هیچ سفارشی ثبت نکرده‌اید. از فروشگاه ما دیدن کنید!
              </p>
              <Link
                href="/shop"
                className="bg-cafe-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                بازگشت به فروشگاه
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          سفارش #{order.id.slice(-8)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            <span>{formatPrice(order.total)} تومان</span>
                          </div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusInfo.text}</span>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-4">آیتم‌های سفارش:</h4>
                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <img
                              src={item.product.image || '/images/placeholder.jpg'}
                              alt={item.product.nameFa || item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {item.product.nameFa || item.product.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                تعداد: {item.quantity} × {formatPrice(item.price)} تومان
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)} تومان
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.paymentId && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">شماره پیگیری پرداخت:</span> {order.paymentId}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
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

export default OrdersPage;

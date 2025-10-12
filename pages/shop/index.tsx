import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Download, Package, CreditCard, Filter, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'digital' | 'physical' | 'course';
  type: 'ebook' | 'journal' | 'wallpaper' | 'coffee' | 'mug' | 'tea' | 'course';
  images: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

const ShopPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { state: cart, addItem, removeItem, updateQuantity } = useCart();

  // Mock products data
  const products: Product[] = [
    {
      id: '1',
      name: 'مجموعه دستورهای چای ایرانی',
      description: 'راهنمای جامع برای ترکیبات سنتی چای ایرانی و تکنیک‌های دم کردن.',
      price: 199000,
      currency: 'IRR',
      category: 'digital',
      type: 'ebook',
      images: ['/images/products/tea-recipes.jpg'],
      rating: 4.8,
      reviews: 124,
      isBestSeller: true,
    },
    {
      id: '2',
      name: 'دفترچه خاطرات کافه',
      description: 'دفترچه زیبا و قابل چاپ برای ثبت سفر قهوه‌ای و بازدیدهای کافه شما.',
      price: 129000,
      currency: 'IRR',
      category: 'digital',
      type: 'journal',
      images: ['/images/products/cafe-journal.jpg'],
      rating: 4.6,
      reviews: 89,
      isNew: true,
    },
    {
      id: '3',
      name: 'والپیپرهای کافه مارگارت',
      description: 'مجموعه‌ای از والپیپرهای زیبا با تم کافه برای دسکتاپ و موبایل.',
      price: 49000,
      currency: 'IRR',
      category: 'digital',
      type: 'wallpaper',
      images: ['/images/products/wallpapers.jpg'],
      rating: 4.7,
      reviews: 156,
    },
    {
      id: '4',
      name: 'قهوه تخصصی مارگارت',
      description: 'قهوه تخصصی برشته شده با دقت، از بهترین دانه‌های قهوه جهان.',
      price: 450000,
      currency: 'IRR',
      category: 'physical',
      type: 'coffee',
      images: ['/images/products/specialty-coffee.jpg'],
      rating: 4.9,
      reviews: 203,
      isBestSeller: true,
    },
    {
      id: '5',
      name: 'فنجان کافه مارگارت',
      description: 'فنجان سرامیکی زیبا با طراحی منحصر به فرد کافه مارگارت.',
      price: 180000,
      currency: 'IRR',
      category: 'physical',
      type: 'mug',
      images: ['/images/products/cafe-mug.jpg'],
      rating: 4.5,
      reviews: 67,
    },
    {
      id: '6',
      name: 'چای سنتی ایرانی',
      description: 'چای سنتی ایرانی با کیفیت بالا، از بهترین برگ‌های چای.',
      price: 320000,
      currency: 'IRR',
      category: 'physical',
      type: 'tea',
      images: ['/images/products/traditional-tea.jpg'],
      rating: 4.8,
      reviews: 145,
    },
    {
      id: '7',
      name: 'دوره کامل بارستا',
      description: 'دوره جامع آموزش بارستا از مبتدی تا پیشرفته با گواهینامه.',
      price: 2500000,
      currency: 'IRR',
      category: 'course',
      type: 'course',
      images: ['/images/products/barista-course.jpg'],
      rating: 4.9,
      reviews: 89,
      isNew: true,
    },
  ];

  const categories = [
    { id: 'all', name: 'همه محصولات' },
    { id: 'digital', name: 'محصولات دیجیتال' },
    { id: 'physical', name: 'محصولات فیزیکی' },
    { id: 'course', name: 'دوره‌های آنلاین' },
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const addToCart = (product: Product) => {
    addItem(product);
    // Here you would typically show a toast notification
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  return (
    <div className="min-h-screen bg-cafe-cream">
      {/* Hero Section */}
      <section className="bg-cafe-green text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              فروشگاه ما
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              محصولات ممتاز برای علاقه‌مندان قهوه و چای
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-cafe-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-12">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    {product.isNew && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        جدید
                      </div>
                    )}
                    
                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        پرفروش
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 mr-2">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-cafe-green">
                        {formatPrice(product.price)} {product.currency}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {product.category === 'digital' ? (
                          <Download className="w-4 h-4" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                        <span>
                          {product.category === 'digital' ? 'دانلود فوری' : 'ارسال پستی'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>افزودن به سبد خرید</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cart Summary */}
      {cart.items.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  سبد خرید شما ({cart.itemCount} آیتم)
                </h3>
                
                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <span className="text-gray-900 font-medium">{item.name}</span>
                          <p className="text-sm text-gray-500">تعداد: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-medium min-w-[100px] text-left">{formatPrice(item.price * item.quantity)} تومان</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold">مجموع:</span>
                    <span className="text-xl font-bold text-cafe-green">
                      {formatPrice(cart.total)} تومان
                    </span>
                  </div>
                  
                  <Link
                    href="/checkout"
                    className="w-full bg-cafe-green text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>تکمیل خرید</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
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

export default ShopPage;
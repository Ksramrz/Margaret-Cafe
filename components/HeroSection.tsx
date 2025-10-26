import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, BookOpen, Users, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  delay?: number;
}

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        if (response.ok) {
          const products = await response.json();
          // Take only first 3 featured products
          const featured = products.slice(0, 3).map((product: any) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            featured: product.featured
          }));
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: 'فروشگاه آنلاین',
      description: 'محصولات منتخب قهوه و چای ایرانی و جهانی با کیفیت عالی',
      href: '/shop',
    },
    {
      icon: BookOpen,
      title: 'آکادمی قهوه',
      description: 'آموزش تخصصی هنر دم کردن قهوه و چای به روش سنتی و مدرن',
      href: '/courses',
    },
    {
      icon: Users,
      title: 'انجمن قهوه‌دوستان',
      description: 'ارتباط با علاقه‌مندان قهوه و چای از سراسر جهان',
      href: '/community',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cafe-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded text-xs mb-6">
                کافه مارگارت - از سال ۱۴۰۱
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                به کافه مارگارت خوش آمدید
              </h1>
              
              <p className="text-lg text-gray-600 max-w-xl mb-8">
                قهوه و چای ایرانی با کیفیت عالی برای شما
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/shop" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  خرید از فروشگاه
                </Link>
                <Link href="/courses" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  شروع یادگیری
                </Link>
              </div>

            </motion.div>

            {/* Right Content - Featured Product */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-gray-50 rounded-lg p-8"
            >
              {featuredProducts.length > 0 ? (
                <div className="text-center">
                  <img src={featuredProducts[0].image || '/images/placeholder-product.jpg'} alt={featuredProducts[0].title} className="w-full h-64 object-cover rounded-lg mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{featuredProducts[0].title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{featuredProducts[0].description}</p>
                  <div className="text-2xl font-bold text-cafe-green mb-4">
                    {featuredProducts[0].price.toLocaleString()} تومان
                  </div>
                  <Link href="/shop" className="inline-block bg-cafe-green text-white px-6 py-2 rounded">
                    خرید
                  </Link>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Coffee className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-sm">محصول ویژه‌ای موجود نیست</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-8">خدمات ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <a key={feature.href} href={feature.href} className="text-center p-6 border rounded-lg hover:border-cafe-green transition">
                <feature.icon className="w-12 h-12 mx-auto mb-3 text-cafe-green" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-12 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">برنامه وفاداری ☕</h2>
            <p className="text-lg text-gray-600">هر روز بیایید، فنجان رایگان بگیرید!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/user/dashboard" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center group border-2 border-transparent hover:border-amber-200">
              <div className="text-5xl mb-3">☕</div>
              <h3 className="text-xl font-bold mb-2">فنجان‌های من</h3>
              <p className="text-gray-600 text-sm mb-4">هر خرید و فعالیت = فنجان رایگان!</p>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
                ورود به داشبورد
              </button>
            </Link>

            <Link href="/leaderboard" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center group border-2 border-transparent hover:border-amber-200">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">رده‌بندی</h3>
              <p className="text-gray-600 text-sm mb-4">مسابقه برای جایزه هفتگی رایگان</p>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
                مشاهده رتبه‌ها
              </button>
            </Link>

            <Link href="/user/rewards" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center group border-2 border-transparent hover:border-amber-200">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-xl font-bold mb-2">جوایز</h3>
              <p className="text-gray-600 text-sm mb-4">فنجان‌های خود را خرج کنید</p>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
                مشاهده جوایز
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-center mb-8">محصولات ویژه</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow">
                  <img src={product.image || '/images/placeholder-product.jpg'} alt={product.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-cafe-green">{product.price.toLocaleString()} تومان</div>
                      <Link href="/shop" className="text-sm text-cafe-green hover:underline">مشاهده</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HeroSection;
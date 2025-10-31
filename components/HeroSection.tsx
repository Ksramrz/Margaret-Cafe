import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, BookOpen, Users, ShoppingBag, Sparkles, Award } from 'lucide-react';
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
      color: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: BookOpen,
      title: 'آکادمی قهوه',
      description: 'آموزش تخصصی هنر دم کردن قهوه و چای به روش سنتی و مدرن',
      href: '/courses',
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: Users,
      title: 'انجمن قهوه‌دوستان',
      description: 'ارتباط با علاقه‌مندان قهوه و چای از سراسر جهان',
      href: '/community',
      color: 'from-brown-500 to-cafe-brown',
      iconBg: 'bg-amber-100',
      iconColor: 'text-brown-600',
    },
  ];

  return (
    <div className="min-h-screen cafe-bg-gradient cafe-pattern relative overflow-hidden">
      {/* Decorative coffee elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-cafe-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-cafe-green px-5 py-2.5 rounded-full text-sm font-medium shadow-cafe mb-4"
              >
                <Coffee className="w-4 h-4" />
                <span>کافه مارگارت - از سال ۱۴۰۱</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight cafe-text-shadow"
              >
                به کافه مارگارت{' '}
                <span className="text-gradient">خوش آمدید</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 max-w-xl leading-relaxed"
              >
                قهوه و چای ایرانی با کیفیت عالی برای شما. هر فنجان یک داستان است.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Link href="/shop" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group">
                  <ShoppingBag className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  خرید از فروشگاه
                </Link>
                <Link href="/courses" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center group">
                  <BookOpen className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  شروع یادگیری
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-4"
              >
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۵۰۰+</div>
                  <div className="text-sm text-gray-600">مشتری راضی</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۱۰۰+</div>
                  <div className="text-sm text-gray-600">محصول ویژه</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۵</div>
                  <div className="text-sm text-gray-600">ستاره رضایت</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Featured Product */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {featuredProducts.length > 0 ? (
                <div className="relative bg-white rounded-3xl p-8 shadow-cafe-xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cafe-green/5 to-amber-50/50"></div>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl mb-6 group">
                      <img 
                        src={featuredProducts[0].image || '/images/placeholder-product.jpg'} 
                        alt={featuredProducts[0].title} 
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ محصول ویژه
                      </div>
                    </div>
                    <h3 className="font-bold text-2xl mb-3 text-gray-900">{featuredProducts[0].title}</h3>
                    <p className="text-gray-600 mb-5 line-clamp-2">{featuredProducts[0].description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gradient-amber">
                        {featuredProducts[0].price.toLocaleString()} تومان
                      </div>
                      <Link href="/shop" className="btn-primary">
                        خرید
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 shadow-cafe-xl text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-cafe-green/10 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                    <Coffee className="w-16 h-16 text-cafe-green" />
                  </div>
                  <p className="text-gray-500 font-medium">به زودی محصولات ویژه اضافه می‌شوند</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تجربه کامل از خرید تا یادگیری و ارتباط با جامعه قهوه‌دوستان
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.a
                key={feature.href}
                href={feature.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group card-hover relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cafe-green transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full cafe-pattern opacity-30"></div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6 shadow-cafe">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-700">برنامه وفاداری</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              هر روز بیایید، فنجان رایگان بگیرید! ☕
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              با هر خرید و فعالیت، فنجان‌های بیشتری کسب کنید و از جوایز ویژه استفاده کنید
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { href: '/user/dashboard', icon: '☕', title: 'فنجان‌های من', desc: 'هر خرید و فعالیت = فنجان رایگان!', color: 'from-amber-400 to-orange-500' },
              { href: '/leaderboard', icon: '🏆', title: 'رده‌بندی', desc: 'مسابقه برای جایزه هفتگی رایگان', color: 'from-yellow-400 to-amber-500' },
              { href: '/user/rewards', icon: '🎁', title: 'جوایز', desc: 'فنجان‌های خود را خرج کنید', color: 'from-orange-400 to-red-500' },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={item.href} className="block h-full">
                  <div className="bg-white rounded-3xl p-8 shadow-cafe-lg hover:shadow-cafe-xl transition-all duration-300 text-center group border-2 border-transparent hover:border-amber-200 transform hover:scale-105">
                    <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.desc}</p>
                    <div className={`bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all group-hover:scale-105`}>
                      مشاهده بیشتر
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white relative">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">محصولات ویژه</h2>
              <p className="text-lg text-gray-600">انتخاب‌های ویژه ما را از دست ندهید</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href="/shop" className="block h-full">
                    <div className="card-hover overflow-hidden h-full">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img
                          src={product.image || '/images/placeholder-product.jpg'}
                          alt={product.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                          ⭐ ویژه
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-cafe-green transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gradient-amber">
                          {product.price.toLocaleString()} تومان
                        </div>
                        <span className="text-cafe-green font-medium group-hover:underline">مشاهده →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HeroSection;

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coffee, BookOpen, Users, ShoppingBag, ArrowRight, Star, Clock, Award, Heart, Zap } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  delay: number;
}

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, href, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
    >
      <Link href={href}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
          <div className="flex items-center justify-center text-primary-600 font-semibold group-hover:text-primary-700">
            Explore
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ id, title, description, price, image, featured, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative"
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-12 h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={image || '/images/placeholder-product.jpg'}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-product.jpg';
            }}
          />
        </div>
        {featured && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            پرفروش
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">(4.5)</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-cafe-green">
            {price.toLocaleString()} تومان
          </div>
          <Link href="/shop" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            مشاهده
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        if (response.ok) {
          const products = await response.json();
          // Take only first 3 featured products
          const featured = products.slice(0, 3).map((product: any, index: number) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            featured: product.featured,
            delay: index * 0.1
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
              <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" />
                کافه مارگارت - از سال ۱۴۰۱
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                به{' '}
                <span className="text-gradient">کافه مارگارت</span>
                <br />
                خوش آمدید
              </h1>
              
              <p className="text-xl text-gray-700 font-medium">
                کافه‌ای در ایران، جامعه‌ای در سراسر جهان
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                تجربه‌ای از ترکیب کامل مهمان‌نوازی اصیل ایرانی و فرهنگ جهانی کافه. 
                از گوشه دنج ما در ایران تا خانه شما در هر جای جهان.
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

              {/* Quick Stats */}
              <div className="flex items-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cafe-green">۵۰۰+</div>
                  <div className="text-gray-600 text-sm">محصول متنوع</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cafe-green">۱۰۰۰+</div>
                  <div className="text-gray-600 text-sm">مشتری راضی</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cafe-green">۵۰+</div>
                  <div className="text-gray-600 text-sm">کشور</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Featured Product */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 lg:p-12 text-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Coffee className="w-12 h-12 lg:w-16 lg:h-16 text-primary-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">محصول ویژه هفته</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">بهترین محصولات کافه مارگارت</p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-cafe-green mb-1">محصولات ویژه</div>
                  <div className="text-sm text-gray-500">از فروشگاه ما</div>
                </div>
                <Link href="/shop" className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  خرید کنید
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop-Focused Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              چرا کافه مارگارت؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              کیفیت، اصالت و تجربه‌ای منحصر به فرد در هر فنجان
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-cafe-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              محصولات پرفروش
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              انتخاب مشتریان ما از بهترین محصولات کافه مارگارت
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green mx-auto mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری محصولات ویژه...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                محصول ویژه‌ای موجود نیست
              </h3>
              <p className="text-gray-600 mb-6">
                در حال حاضر محصول ویژه‌ای برای نمایش وجود ندارد
              </p>
              <Link href="/shop" className="btn-primary">
                مشاهده همه محصولات
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    featured={product.featured}
                    delay={index * 0.1}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link href="/shop" className="btn-primary text-lg px-8 py-4">
                  مشاهده همه محصولات
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
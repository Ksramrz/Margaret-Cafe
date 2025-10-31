import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Coffee, BookOpen, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
}

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      description: 'محصولات منتخب قهوه و چای ایرانی و جهانی',
      href: '/shop',
    },
    {
      icon: BookOpen,
      title: 'آکادمی قهوه',
      description: 'آموزش تخصصی هنر دم کردن قهوه و چای',
      href: '/courses',
    },
    {
      icon: Users,
      title: 'انجمن قهوه‌دوستان',
      description: 'ارتباط با علاقه‌مندان قهوه و چای',
      href: '/community',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-cafe-green/10 text-cafe-green px-4 py-2 rounded-full text-sm font-semibold">
                <Coffee className="w-4 h-4" />
                <span>کافه مارگارت - از سال ۱۴۰۱</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-cafe-charcoal leading-tight">
                به کافه مارگارت{' '}
                <span className="text-cafe-green">خوش آمدید</span>
              </h1>
              
              <p className="text-xl text-cafe-charcoal-light max-w-xl leading-relaxed">
                قهوه و چای ایرانی با کیفیت عالی برای شما. هر فنجان یک داستان است.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  href="/shop" 
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  خرید از فروشگاه
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/courses" 
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  شروع یادگیری
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-12 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۵۰۰+</div>
                  <div className="text-sm text-cafe-charcoal-light mt-1">مشتری راضی</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۱۰۰+</div>
                  <div className="text-sm text-cafe-charcoal-light mt-1">محصول ویژه</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cafe-green">۵</div>
                  <div className="text-sm text-cafe-charcoal-light mt-1">ستاره رضایت</div>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Product */}
            <div className="relative">
              {featuredProducts.length > 0 ? (
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src={featuredProducts[0].image || '/images/placeholder-product.jpg'} 
                      alt={featuredProducts[0].title} 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      ⭐ محصول ویژه
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-cafe-charcoal">{featuredProducts[0].title}</h3>
                  <p className="text-cafe-charcoal-light mb-5">{featuredProducts[0].description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-cafe-green">
                      {featuredProducts[0].price.toLocaleString()} تومان
                    </div>
                    <Link href="/shop" className="btn-primary">
                      خرید
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-12 shadow-xl text-center border border-gray-200">
                  <div className="w-32 h-32 bg-cafe-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Coffee className="w-16 h-16 text-cafe-green" />
                  </div>
                  <p className="text-cafe-charcoal-light font-medium">به زودی محصولات ویژه اضافه می‌شوند</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">خدمات ما</h2>
            <p className="text-lg text-cafe-charcoal-light max-w-2xl mx-auto">
              تجربه کامل از خرید تا یادگیری و ارتباط با جامعه قهوه‌دوستان
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="card-hover group"
              >
                <div className="w-16 h-16 bg-cafe-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cafe-green group-hover:text-white transition-colors">
                  <feature.icon className="w-8 h-8 text-cafe-green group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-cafe-charcoal group-hover:text-cafe-green transition-colors">
                  {feature.title}
                </h3>
                <p className="text-cafe-charcoal-light leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">محصولات ویژه</h2>
              <p className="text-lg text-cafe-charcoal-light">انتخاب‌های ویژه ما را از دست ندهید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href="/shop" className="card-hover group">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={product.image || '/images/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                      ⭐ ویژه
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-cafe-charcoal group-hover:text-cafe-green transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-cafe-charcoal-light text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-cafe-green">
                      {product.price.toLocaleString()} تومان
                    </div>
                    <span className="text-cafe-green font-semibold group-hover:underline">مشاهده →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HeroSection;

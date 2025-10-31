import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, BookOpen, Users, ShoppingBag, ArrowRight, Zap, Globe2 } from 'lucide-react';
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
      gradient: 'from-neon-green to-neon-cyan',
    },
    {
      icon: BookOpen,
      title: 'آکادمی قهوه',
      description: 'آموزش تخصصی هنر دم کردن قهوه و چای',
      href: '/courses',
      gradient: 'from-neon-purple to-neon-pink',
    },
    {
      icon: Users,
      title: 'انجمن قهوه‌دوستان',
      description: 'ارتباط با علاقه‌مندان قهوه و چای',
      href: '/community',
      gradient: 'from-neon-cyan to-neon-blue',
    },
  ];

  return (
    <div className="min-h-screen web3-bg relative overflow-hidden">
      {/* Animated Glow Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-pulse-neon"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative py-32 lg:py-40">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full text-sm font-bold border border-neon-green/30 shadow-neon-green">
                <Coffee className="w-5 h-5 text-neon-green" />
                <span className="text-gradient">کافه مارگارت Web3 - از سال ۱۴۰۱</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-dark-text">به کافه مارگارت</span>
                <br />
                <span className="text-gradient">Web3 خوش آمدید</span>
              </h1>
              
              <p className="text-xl text-dark-text-secondary max-w-xl leading-relaxed">
                آینده قهوه در بلاک‌چین. کیفیت دیجیتال، تجربه واقعی. هر فنجان یک NFT است.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/shop" 
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  خرید از فروشگاه
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                <div className="glass px-6 py-4 rounded-xl border border-neon-green/20">
                  <div className="text-3xl font-bold text-gradient mb-1">۵۰۰+</div>
                  <div className="text-sm text-dark-text-secondary font-medium">مشتری راضی</div>
                </div>
                <div className="glass px-6 py-4 rounded-xl border border-neon-cyan/20">
                  <div className="text-3xl font-bold text-gradient mb-1">۱۰۰+</div>
                  <div className="text-sm text-dark-text-secondary font-medium">محصول NFT</div>
                </div>
                <div className="glass px-6 py-4 rounded-xl border border-neon-purple/20">
                  <div className="text-3xl font-bold text-gradient mb-1">۵</div>
                  <div className="text-sm text-dark-text-secondary font-medium">ستاره رضایت</div>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Product */}
            <div className="relative">
              {featuredProducts.length > 0 ? (
                <div className="card-glass relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-xl mb-6">
                      <img 
                        src={featuredProducts[0].image || '/images/placeholder-product.jpg'} 
                        alt={featuredProducts[0].title} 
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 glass px-4 py-2 rounded-lg border border-neon-green/50 shadow-neon-green">
                        <span className="text-neon-green font-bold text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          محصول NFT
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-2xl mb-3 text-dark-text">{featuredProducts[0].title}</h3>
                    <p className="text-dark-text-secondary mb-5">{featuredProducts[0].description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gradient">
                        {featuredProducts[0].price.toLocaleString()} تومان
                      </div>
                      <Link href="/shop" className="btn-primary">
                        خرید
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-glass text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-neon">
                    <Coffee className="w-16 h-16 text-neon-green" />
                  </div>
                  <p className="text-dark-text-secondary font-medium">به زودی محصولات NFT اضافه می‌شوند</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-dark-text mb-4">خدمات ما</h2>
            <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
              تجربه کامل از خرید تا یادگیری و ارتباط با جامعه قهوه‌دوستان Web3
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="card-glass group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-neon-green`}>
                  <feature.icon className="w-8 h-8 text-dark-bg" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark-text group-hover:text-gradient transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-text-secondary leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="section-padding relative z-10">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-dark-text mb-4">محصولات NFT ویژه</h2>
              <p className="text-lg text-dark-text-secondary">انتخاب‌های ویژه ما را از دست ندهید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href="/shop" className="card-glass group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={product.image || '/images/placeholder-product.jpg'}
                        alt={product.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-lg border border-neon-green/50">
                        <span className="text-neon-green font-bold text-sm">⭐ NFT</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-dark-text group-hover:text-gradient transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-dark-text-secondary text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gradient">
                        {product.price.toLocaleString()} تومان
                      </div>
                      <span className="text-neon-green font-semibold group-hover:underline">مشاهده →</span>
                    </div>
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

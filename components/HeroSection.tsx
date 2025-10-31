import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Coffee, BookOpen, Users, ShoppingBag, Sparkles, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Fetch featured products
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

  // GSAP Animations
  useGSAP(() => {
    if (!heroRef.current) return;

    // Hero text animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.children,
        {
          opacity: 0,
          y: 80,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.8,
        }
      );
    }

    // Badge animation
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: -20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 0.2,
        }
      );
    }

    // CTA buttons animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.children,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          delay: 1.2,
        }
      );
    }

    // Product card animation
    if (productRef.current) {
      gsap.fromTo(
        productRef.current,
        {
          opacity: 0,
          scale: 0.8,
          rotationY: -15,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }

    // Stats animation
    gsap.utils.toArray('.stat-item').forEach((stat: any) => {
      gsap.fromTo(
        stat,
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 1.5,
          scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Floating decorative elements
    gsap.to('.float-element-1', {
      y: -30,
      duration: 4,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('.float-element-2', {
      y: -40,
      duration: 5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5,
    });

    // Parallax effect for product image
    if (productRef.current) {
      gsap.to(productRef.current.querySelector('.product-image'), {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: productRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, [loading]);

  // Features scroll reveal
  useGSAP(() => {
    if (!featuresRef.current) return;

    const features = featuresRef.current.querySelectorAll('.feature-card');
    
    features.forEach((feature, index) => {
      gsap.fromTo(
        feature,
        {
          opacity: 0,
          y: 60,
          rotationY: 15,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [loading]);

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

  // Split title into spans for animation
  const titleWords = 'به کافه مارگارت خوش آمدید'.split(' ');
  const gradientWords = ['کافه', 'مارگارت', 'خوش', 'آمدید'];

  return (
    <div ref={heroRef} className="min-h-screen cafe-bg-gradient cafe-pattern relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="float-element-1 absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-cafe-green/10 to-amber-100/20 rounded-full blur-3xl"></div>
      <div className="float-element-2 absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(45, 80, 30, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(45, 80, 30, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}></div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div ref={badgeRef} className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-cafe-green px-6 py-3 rounded-full text-sm font-bold shadow-cafe-lg border border-cafe-green/10">
                <Coffee className="w-5 h-5" />
                <span>کافه مارگارت - از سال ۱۴۰۱</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              {/* Title with split animation */}
              <h1 ref={titleRef} className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                {titleWords.map((word, i) => {
                  const isGradient = gradientWords.includes(word);
                  return (
                    <span key={i} className="inline-block">
                      <span className={isGradient ? 'text-gradient bg-gradient-to-r from-cafe-green via-cafe-green-light to-amber-600 bg-clip-text text-transparent' : ''}>
                        {word}
                      </span>
                      {i < titleWords.length - 1 && ' '}
                    </span>
                  );
                })}
              </h1>
              
              {/* Subtitle */}
              <p ref={subtitleRef} className="text-xl lg:text-2xl text-gray-600 max-w-xl leading-relaxed">
                قهوه و چای ایرانی با کیفیت عالی برای شما. هر فنجان یک داستان است، هر جرعه یک تجربه.
              </p>
              
              {/* CTA Buttons */}
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/shop" 
                  className="group btn-primary text-lg px-8 py-4 inline-flex items-center justify-center relative overflow-hidden"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }}
                >
                  <ShoppingBag className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  خرید از فروشگاه
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/courses" 
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center group"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }}
                >
                  <BookOpen className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  شروع یادگیری
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6">
                {[
                  { value: '۵۰۰+', label: 'مشتری راضی' },
                  { value: '۱۰۰+', label: 'محصول ویژه' },
                  { value: '۵', label: 'ستاره رضایت' },
                ].map((stat, i) => (
                  <div key={i} className="stat-item">
                    <div className="text-3xl font-black text-cafe-green">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Featured Product */}
            <div ref={productRef} className="relative">
              {featuredProducts.length > 0 ? (
                <div className="relative bg-white rounded-3xl p-8 shadow-cafe-xl overflow-hidden group transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-cafe-green/5 via-amber-50/50 to-transparent"></div>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl mb-6 group">
                      <img 
                        src={featuredProducts[0].image || '/images/placeholder-product.jpg'} 
                        alt={featuredProducts[0].title}
                        className="product-image w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-2xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        محصول ویژه
                      </div>
                    </div>
                    <h3 className="font-black text-2xl mb-3 text-gray-900">{featuredProducts[0].title}</h3>
                    <p className="text-gray-600 mb-5 line-clamp-2">{featuredProducts[0].description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-black text-gradient-amber">
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
                  <div className="w-32 h-32 bg-gradient-to-br from-cafe-green/10 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Coffee className="w-16 h-16 text-cafe-green" />
                  </div>
                  <p className="text-gray-500 font-medium">به زودی محصولات ویژه اضافه می‌شوند</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Scroll Reveal */}
      <section ref={featuresRef} className="py-20 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تجربه کامل از خرید تا یادگیری و ارتباط با جامعه قهوه‌دوستان
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <a
                key={feature.href}
                href={feature.href}
                className="feature-card group card-hover relative overflow-hidden"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    y: -8,
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cafe-green transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden z-10">
        <div className="absolute inset-0 cafe-pattern opacity-30"></div>
        <div className="container-custom relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-full mb-6 shadow-cafe-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="font-black text-amber-700">برنامه وفاداری</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4">
              هر روز بیایید، فنجان رایگان بگیرید! ☕
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              با هر خرید و فعالیت، فنجان‌های بیشتری کسب کنید و از جوایز ویژه استفاده کنید
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { href: '/user/dashboard', icon: '☕', title: 'فنجان‌های من', desc: 'هر خرید و فعالیت = فنجان رایگان!', color: 'from-amber-400 to-orange-500' },
              { href: '/leaderboard', icon: '🏆', title: 'رده‌بندی', desc: 'مسابقه برای جایزه هفتگی رایگان', color: 'from-yellow-400 to-amber-500' },
              { href: '/user/rewards', icon: '🎁', title: 'جوایز', desc: 'فنجان‌های خود را خرج کنید', color: 'from-orange-400 to-red-500' },
            ].map((item, index) => (
              <Link key={item.href} href={item.href} className="block h-full group">
                <div className="bg-white rounded-3xl p-8 shadow-cafe-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent hover:border-amber-200 transform hover:scale-105">
                  <div className="text-7xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.desc}</p>
                  <div className={`bg-gradient-to-r ${item.color} text-white px-6 py-3.5 rounded-xl font-black hover:shadow-xl transition-all group-hover:scale-105`}>
                    مشاهده بیشتر
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;

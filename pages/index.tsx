import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '@/components/HeroSection';
import { Coffee, Truck, Shield, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const shopBenefits = [
    {
      icon: Coffee,
      title: 'کیفیت تضمین شده',
      description: 'همه محصولات ما با بالاترین استانداردهای کیفیت انتخاب شده‌اند'
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      description: 'ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان'
    },
    {
      icon: Shield,
      title: 'ضمانت بازگشت',
      description: 'در صورت عدم رضایت، محصول را بازگردانید'
    },
    {
      icon: Heart,
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی ما همیشه آماده کمک به شماست'
    }
  ];

  return (
    <>
      <HeroSection />
      
      {/* Shop Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">
              چرا از کافه مارگارت خرید کنیم؟
            </h2>
            <p className="text-lg text-cafe-charcoal-light max-w-2xl mx-auto">
              ما متعهد به ارائه بهترین تجربه خرید برای شما هستیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-cafe-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-cafe-green" />
                </div>
                <h3 className="text-lg font-bold text-cafe-charcoal mb-2">{benefit.title}</h3>
                <p className="text-cafe-charcoal-light text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">
              در خبرنامه ما عضو شوید
            </h2>
            <p className="text-lg text-cafe-charcoal-light mb-8">
              آخرین محصولات، تخفیف‌ها و اخبار کافه مارگارت را دریافت کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-cafe-green transition-all"
              />
              <button className="btn-primary whitespace-nowrap">
                عضویت
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default HomePage;

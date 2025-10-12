import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';
import { Coffee, Star, Truck, Shield, Heart } from 'lucide-react';

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              چرا از کافه مارگارت خرید کنیم؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ما متعهد به ارائه بهترین تجربه خرید برای شما هستیم
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shopBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-cafe-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              در خبرنامه ما عضو شوید
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              آخرین محصولات، تخفیف‌ها و اخبار کافه مارگارت را دریافت کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap">
                عضویت
              </button>
            </div>
          </motion.div>
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

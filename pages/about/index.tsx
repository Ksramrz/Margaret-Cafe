import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Heart, Users, Award, Coffee, MapPin, Clock, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'اصالت',
      description: 'ما به روش‌های سنتی وفادار می‌مانیم و در عین حال نوآوری را در آغوش می‌گیریم.',
    },
    {
      icon: Users,
      title: 'جامعه',
      description: 'ایجاد ارتباطاتی که مرزهای جغرافیایی را در می‌نوردد.',
    },
    {
      icon: Award,
      title: 'کیفیت',
      description: 'متعهد به تعالی در هر فنجان، هر دوره و هر تعامل.',
    },
    {
      icon: Coffee,
      title: 'آموزش',
      description: 'توانمندسازی دیگران از طریق اشتراک دانش و توسعه مهارت.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cafe-green text-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              درباره کافه مارگارت
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              داستان ما، مأموریت ما و تیم پرشور پشت جامعه جهانی ما.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-cafe-charcoal mb-6">داستان ما</h2>
              <div className="prose prose-lg mx-auto text-cafe-charcoal-light">
                <p className="text-lg leading-relaxed mb-6">
                  تأسیس شده در سال ۱۴۰۱ در قلب ایران، کافه مارگارت به عنوان یک کافه محلی کوچک با رویای بزرگ شروع شد: 
                  اشتراک گرمای مهمان‌نوازی ایرانی و هنر دم کردن کامل با جهان.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  آنچه به عنوان یک مکان گردهمایی محلی شروع شد، به جامعه جهانی علاقه‌مندان قهوه و چای تبدیل شده است. 
                  ما معتقدیم که قهوه و چای عالی قدرت گرد هم آوردن مردم را دارند، صرف نظر از اینکه در کجای جهان هستند.
                </p>
                <p className="text-lg leading-relaxed">
                  امروز، کافه مارگارت نه تنها به عنوان یک کافه فیزیکی در تهران، بلکه به عنوان یک پلتفرم دیجیتال 
                  عمل می‌کند که عاشقان قهوه را در سراسر جهان از طریق آموزش، جامعه و تجربیات مشترک متصل می‌کند.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
              <h3 className="text-2xl font-bold text-cafe-charcoal mb-4">مأموریت ما</h3>
              <p className="text-lg text-cafe-charcoal-light italic">
                "پل زدن بین فرهنگ‌ها از طریق زبان جهانی قهوه و چای، ایجاد ارتباطات معنادار و اشتراک دانشی که زندگی‌ها را در سراسر جهان غنی می‌کند."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50 border-t border-gray-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">ارزش‌های ما</h2>
            <p className="text-lg text-cafe-charcoal-light max-w-2xl mx-auto">
              اصولی که همه کارهای ما در کافه مارگارت را هدایت می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card text-center">
                <div className="w-16 h-16 bg-cafe-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-cafe-green" />
                </div>
                <h3 className="text-xl font-bold text-cafe-charcoal mb-3">{value.title}</h3>
                <p className="text-cafe-charcoal-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">با ما در تماس باشید</h2>
            <p className="text-lg text-cafe-charcoal-light max-w-2xl mx-auto">
              ما دوست داریم از شما بشنویم و به سؤالات شما پاسخ دهیم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <MapPin className="w-8 h-8 text-cafe-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cafe-charcoal mb-2">آدرس</h3>
              <p className="text-cafe-charcoal-light">تهران، ایران<br />خیابان ولیعصر، پلاک ۱۲۳</p>
            </div>

            <div className="card text-center">
              <Clock className="w-8 h-8 text-cafe-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cafe-charcoal mb-2">ساعات کاری</h3>
              <p className="text-cafe-charcoal-light">شنبه تا پنج‌شنبه: ۸ صبح تا ۱۰ شب<br />جمعه: ۱۰ صبح تا ۱۱ شب</p>
            </div>

            <div className="card text-center">
              <Phone className="w-8 h-8 text-cafe-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cafe-charcoal mb-2">تماس</h3>
              <p className="text-cafe-charcoal-light">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸<br />ایمیل: info@margaretcafe.com</p>
            </div>
          </div>
        </div>
      </section>
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

export default AboutPage;

import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Coffee, MapPin, Clock, Phone, Mail } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');

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

  const team = [
    {
      name: 'مارگارت جانسون',
      role: 'بنیان‌گذار و سر بارستا',
      image: '/images/team/margaret.jpg',
      bio: 'با بیش از ۱۵ سال تجربه در صنعت قهوه، مارگارت شور و تخصص را در هر فنجان به ارمغان می‌آورد.',
    },
    {
      name: 'احمد رضایی',
      role: 'استاد چای',
      image: '/images/team/ahmad.jpg',
      bio: 'احمد در دم کردن چای سنتی ایرانی تخصص دارد و بیش از یک دهه دانش خود را به اشتراک گذاشته است.',
    },
    {
      name: 'سارا چن',
      role: 'مدیر جامعه',
      image: '/images/team/sarah.jpg',
      bio: 'سارا جامعه جهانی ما را متصل می‌کند و اطمینان می‌دهد که هر عضو احساس خوشامدگویی و پشتیبانی کند.',
    },
  ];

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
              درباره کافه مارگارت
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              داستان ما، مأموریت ما و تیم پرشور پشت جامعه جهانی ما.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">داستان ما</h2>
              <div className="prose prose-lg mx-auto text-gray-600">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-cafe-light rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">مأموریت ما</h3>
              <p className="text-lg text-gray-600 italic">
                "پل زدن بین فرهنگ‌ها از طریق زبان جهانی قهوه و چای، ایجاد ارتباطات معنادار و اشتراک دانشی که زندگی‌ها را در سراسر جهان غنی می‌کند."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ارزش‌های ما</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اصولی که همه کارهای ما در کافه مارگارت را هدایت می‌کند.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تیم ما</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              افرادی که کافه مارگارت را به مکانی خاص تبدیل کرده‌اند.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">با ما در تماس باشید</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ما دوست داریم از شما بشنویم و به سؤالات شما پاسخ دهیم.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">آدرس</h3>
              <p className="text-gray-600">تهران، ایران<br />خیابان ولیعصر، پلاک ۱۲۳</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <Clock className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ساعات کاری</h3>
              <p className="text-gray-600">شنبه تا پنج‌شنبه: ۸ صبح تا ۱۰ شب<br />جمعه: ۱۰ صبح تا ۱۱ شب</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <Phone className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">تماس</h3>
              <p className="text-gray-600">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸<br />ایمیل: info@margaretcafe.com</p>
            </motion.div>
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
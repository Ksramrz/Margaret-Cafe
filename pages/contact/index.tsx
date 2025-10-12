import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Coffee, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to your backend
    toast.success('پیام با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'آدرس',
      details: ['تهران، ایران', 'خیابان ولیعصر، پلاک ۱۲۳'],
    },
    {
      icon: Phone,
      title: 'تلفن',
      details: ['۰۲۱-۱۲۳۴۵۶۷۸', '۰۹۱۲۳۴۵۶۷۸۹'],
    },
    {
      icon: Mail,
      title: 'ایمیل',
      details: ['hello@margaretcafe.com', 'support@margaretcafe.com'],
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      details: ['شنبه تا پنج‌شنبه: ۸ صبح تا ۱۰ شب', 'جمعه: ۱۰ صبح تا ۱۱ شب'],
    },
  ];

  const features = [
    {
      icon: Coffee,
      title: 'قهوه تخصصی',
      description: 'بهترین قهوه‌های جهان را در محیطی آرام و دوستانه تجربه کنید',
    },
    {
      icon: Users,
      title: 'جامعه گرم',
      description: 'با علاقه‌مندان قهوه و چای از سراسر جهان ارتباط برقرار کنید',
    },
    {
      icon: MessageCircle,
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی ما همیشه آماده پاسخگویی به سؤالات شماست',
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
              با ما در تماس باشید
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              دوست داریم از شما بشنویم و به سؤالات شما پاسخ دهیم
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">پیام خود را ارسال کنید</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس ایمیل
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      موضوع
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                      placeholder="موضوع پیام خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      پیام
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                      placeholder="پیام خود را اینجا بنویسید..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-cafe-green text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>ارسال پیام</span>
                  </button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">اطلاعات تماس</h2>
                  
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cafe-light rounded-lg flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-cafe-green" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {info.title}
                          </h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>نقشه موقعیت کافه مارگارت</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                چرا کافه مارگارت را انتخاب کنید؟
              </h2>
              <p className="text-lg text-gray-600">
                ویژگی‌هایی که ما را منحصر به فرد می‌کند
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                سؤالات متداول
              </h2>
              <p className="text-lg text-gray-600">
                پاسخ سؤالات رایج شما
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: 'ساعات کاری کافه مارگارت چیست؟',
                  answer: 'ما از شنبه تا پنج‌شنبه از ساعت ۸ صبح تا ۱۰ شب و در روزهای جمعه از ساعت ۱۰ صبح تا ۱۱ شب باز هستیم.'
                },
                {
                  question: 'آیا امکان رزرو میز وجود دارد؟',
                  answer: 'بله، شما می‌توانید از طریق تماس تلفنی یا وب‌سایت ما میز خود را رزرو کنید.'
                },
                {
                  question: 'آیا دوره‌های آموزشی برگزار می‌کنید؟',
                  answer: 'بله، ما دوره‌های مختلف بارستا، لته آرت و چای‌شناسی برگزار می‌کنیم. برای اطلاعات بیشتر با ما تماس بگیرید.'
                },
                {
                  question: 'آیا امکان خرید آنلاین وجود دارد؟',
                  answer: 'بله، شما می‌توانید محصولات ما را از فروشگاه آنلاین خریداری کنید و درب منزل تحویل بگیرید.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
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

export default ContactPage;
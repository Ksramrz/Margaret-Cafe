import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  const footerLinks = {
    company: [
      { name: t('common.about'), href: '/about' },
      { name: t('common.contact'), href: '/contact' },
      { name: 'فرصت‌های شغلی', href: '#' },
      { name: 'اخبار', href: '#' },
    ],
    products: [
      { name: t('common.shop'), href: '/shop' },
      { name: t('common.courses'), href: '/courses' },
      { name: t('common.blog'), href: '/blog' },
      { name: t('common.community'), href: '/community' },
    ],
    support: [
      { name: 'مرکز راهنمایی', href: '#' },
      { name: 'اطلاعات ارسال', href: '#' },
      { name: 'بازگشت کالا', href: '#' },
      { name: 'حریم خصوصی', href: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-cafe-green via-cafe-green-light to-cafe-green-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 cafe-pattern opacity-10"></div>
      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Logo size="sm" showText={true} textColor="text-white" />
            </Link>
            <p className="text-green-100 mb-6 leading-relaxed">
              کافه‌ای در ایران، جامعه‌ای در سراسر جهان. تجربه مهمان‌نوازی اصیل ایرانی و فرهنگ کافه جهانی.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 hover:border-white/20 shadow-lg"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">شرکت</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">محصولات</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">پشتیبانی</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-green-100 text-lg">
            © ۱۴۰۴ کافه مارگارت. تمامی حقوق محفوظ است. Made with ❤️ in Iran.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

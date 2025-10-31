import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
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
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-cafe-green">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <Logo size="sm" showText={true} textColor="text-white" />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              کافه‌ای در ایران، جامعه‌ای در سراسر جهان. تجربه مهمان‌نوازی اصیل ایرانی و فرهنگ کافه جهانی.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>تهران، خیابان ولی‌عصر</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@margaret-cafe.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-cafe-green rounded-lg flex items-center justify-center transition-colors border border-gray-700 hover:border-cafe-green"
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">شرکت</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">محصولات</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">پشتیبانی</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © ۱۴۰۴ کافه مارگارت. تمامی حقوق محفوظ است. Made with ❤️ in Iran.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

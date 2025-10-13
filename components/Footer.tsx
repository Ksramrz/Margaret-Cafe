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
    <footer className="bg-cafe-green text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Logo size="sm" showText={true} textColor="text-white" />
            </Link>
            <p className="text-green-200 mb-4">
              A café in Iran, a community worldwide. Experience authentic Persian hospitality and global café culture.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
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
        <div className="border-t border-green-600 mt-12 pt-8 text-center">
          <p className="text-green-200">
            © 2024 Margaret Café. All rights reserved. Made with ❤️ in Iran.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

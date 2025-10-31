import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'from-neon-pink to-neon-purple' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'from-neon-cyan to-neon-blue' },
    { name: 'Facebook', icon: Facebook, href: '#', color: 'from-neon-blue to-neon-cyan' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'from-red-500 to-red-600' },
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
    <footer className="relative border-t border-dark-border bg-dark-surface/50 backdrop-blur-2xl">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green via-neon-cyan to-transparent"></div>
      
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <Logo size="sm" showText={true} textColor="text-gradient" />
            </Link>
            <p className="text-dark-text-secondary mb-6 leading-relaxed text-sm">
              کافه‌ای در ایران، جامعه‌ای در سراسر جهان. آینده قهوه در Web3.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-dark-text-secondary text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 text-neon-green" />
                <span>تهران، خیابان ولی‌عصر</span>
              </div>
              <div className="flex items-center gap-3 text-dark-text-secondary text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-neon-cyan" />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center gap-3 text-dark-text-secondary text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-neon-purple" />
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
                  className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-xl border border-white/10`}
                >
                  <social.icon className="w-5 h-5 text-dark-bg" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-dark-text font-bold mb-6 text-lg">شرکت</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-dark-text-secondary hover:text-neon-green transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-dark-text font-bold mb-6 text-lg">محصولات</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-dark-text-secondary hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-dark-text font-bold mb-6 text-lg">پشتیبانی</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-dark-text-secondary hover:text-neon-purple transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-border mt-12 pt-8 text-center">
          <p className="text-dark-text-secondary text-sm">
            © ۱۴۰۴ کافه مارگارت Web3. تمامی حقوق محفوظ است. Made with ❤️ in Iran.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-dark-text-secondary text-xs">Built on</span>
            <span className="text-gradient font-bold text-xs">Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

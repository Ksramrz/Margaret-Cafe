import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import Logo from './Logo';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const { state: cart } = useCart();
  const router = useRouter();

  const navigation = [
    { name: t('common.home'), href: '/' },
    { name: t('common.blog'), href: '/blog' },
    { name: t('common.courses'), href: '/courses' },
    { name: t('common.shop'), href: '/shop' },
    { name: t('common.community'), href: '/community' },
    { name: t('common.about'), href: '/about' },
    { name: t('common.contact'), href: '/contact' },
  ];

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size="md" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-cafe-green transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Authentication */}
            {session ? (
              <div className="flex items-center space-x-4">
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-cafe-green transition-colors duration-200 font-medium"
                  >
                    پنل مدیریت
                  </Link>
                )}
                <Link
                  href="/user/dashboard"
                  className="text-gray-700 hover:text-cafe-green transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">خروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-cafe-green transition-colors duration-200 font-medium"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-cafe-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  ثبت نام
                </Link>
              </div>
            )}
          </div>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-md text-gray-600 hover:text-cafe-green hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <button
                onClick={() => changeLanguage(router.locale === 'en' ? 'fa' : 'en')}
                className="text-sm text-gray-600 hover:text-cafe-green transition-colors"
              >
                {router.locale === 'en' ? 'فارسی' : 'English'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-cafe-green hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200"
          >
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:text-cafe-green hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {session ? (
                  <div className="space-y-2">
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-700 hover:text-cafe-green hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        پنل مدیریت
                      </Link>
                    )}
                    <div className="px-4 py-2 text-gray-600">
                      <User className="w-4 h-4 inline ml-2" />
                      {session.user?.name}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full text-right px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 inline ml-2" />
                      خروج
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-gray-700 hover:text-cafe-green hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      ورود
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2 bg-cafe-green text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      ثبت نام
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

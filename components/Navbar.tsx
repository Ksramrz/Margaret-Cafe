import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, ShoppingCart, Sparkles } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-dark-surface/80 border-b border-dark-border/50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full"></div>
              <Logo size="md" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-dark-text-secondary hover:text-neon-green transition-all duration-300 font-medium px-3 py-2 rounded-lg group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                <span className="absolute inset-0 rounded-lg bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
            
            {/* Authentication */}
            {session ? (
              <div className="flex items-center space-x-4">
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-dark-text-secondary hover:text-neon-purple transition-colors duration-200 font-medium flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    پنل مدیریت
                  </Link>
                )}
                <Link
                  href="/user/dashboard"
                  className="text-dark-text-secondary hover:text-neon-cyan transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-dark-text-secondary hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">خروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-dark-text-secondary hover:text-neon-green transition-colors duration-200 font-medium"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary px-6 py-2.5 text-sm font-bold"
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
              className="relative p-2.5 rounded-xl text-dark-text-secondary hover:text-neon-green transition-all duration-300 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-neon-green to-neon-cyan text-dark-bg text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-neon-green animate-pulse-neon">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-dark-text-secondary" />
              <button
                onClick={() => changeLanguage(router.locale === 'en' ? 'fa' : 'en')}
                className="text-sm text-dark-text-secondary hover:text-neon-cyan transition-colors"
              >
                {router.locale === 'en' ? 'فارسی' : 'English'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-dark-text-secondary hover:text-neon-green hover:bg-dark-card transition-colors"
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
            className="lg:hidden border-t border-dark-border backdrop-blur-xl bg-dark-surface/90"
          >
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-dark-text-secondary hover:text-neon-green hover:bg-dark-card transition-colors duration-200 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="border-t border-dark-border pt-4 mt-4">
                {session ? (
                  <div className="space-y-2">
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-dark-text-secondary hover:text-neon-purple hover:bg-dark-card transition-colors duration-200 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        پنل مدیریت
                      </Link>
                    )}
                    <div className="px-4 py-2 text-dark-text-secondary">
                      <User className="w-4 h-4 inline ml-2" />
                      {session.user?.name}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full text-right px-4 py-2 text-dark-text-secondary hover:text-red-400 hover:bg-dark-card transition-colors duration-200 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 inline ml-2" />
                      خروج
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-dark-text-secondary hover:text-neon-green hover:bg-dark-card transition-colors duration-200 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      ورود
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-3 btn-primary text-center rounded-lg"
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

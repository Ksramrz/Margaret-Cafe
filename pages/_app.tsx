import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import CustomCursor from '@/components/CustomCursor';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Run startup check on client side
if (typeof window === 'undefined') {
  // Server side - run startup check
  require('../scripts/startup-check');
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Enable smooth scrolling with CSS
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        {/* Temporarily disable custom cursor - can cause issues */}
        {/* <CustomCursor /> */}
        <div className="min-h-screen flex flex-col">
            <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            <main className="flex-1">
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
            </main>
            <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </div>
      </CartProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);

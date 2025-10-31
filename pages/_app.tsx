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
import ParticleBackground from '@/components/ParticleBackground';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  
  // Hide navbar on 3D café page (homepage)
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        {!isHomePage && <ParticleBackground />}
        <div className="min-h-screen flex flex-col relative z-10">
            {!isHomePage && <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />}
            <main className={isHomePage ? "flex-1" : "flex-1 pt-16"}>
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
            </main>
            {!isHomePage && <Footer />}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#00ff88',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              },
            }}
          />
        </div>
      </CartProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);

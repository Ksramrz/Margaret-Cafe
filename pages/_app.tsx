import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </CartProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);

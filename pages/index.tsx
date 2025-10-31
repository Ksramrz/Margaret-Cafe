import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

// Dynamically import the 3D component to avoid SSR issues
const Cafe3D = dynamic(() => import('@/components/Cafe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-neon-green border-t-transparent mx-auto mb-4"></div>
        <p className="text-dark-text-secondary text-xl">در حال بارگذاری کافه...</p>
      </div>
    </div>
  ),
});

const HomePage: React.FC = () => {
  return <Cafe3D />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fa', ['common'])),
    },
  };
};

export default HomePage;

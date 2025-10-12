import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cafe-cream">
      <section className="bg-cafe-green text-white section-padding">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              دوره‌های آنلاین
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              هنر دم کردن قهوه و چای را بیاموزید
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                دوره‌های ما
              </h2>
              <p className="text-lg text-gray-600">
                دوره‌های تخصصی قهوه و چای در حال آماده‌سازی است...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fa', ['common'])),
    },
  };
};

export default CoursesPage;
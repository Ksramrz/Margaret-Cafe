import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BookOpen, Clock, Award, Users } from 'lucide-react';

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-cafe-green text-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              دوره‌های آنلاین
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              هنر دم کردن قهوه و چای را بیاموزید
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-cafe-charcoal mb-4">
                دوره‌های ما
              </h2>
              <p className="text-lg text-cafe-charcoal-light">
                دوره‌های تخصصی قهوه و چای در حال آماده‌سازی است...
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: 'آموزش بارستا',
                  description: 'یادگیری تکنیک‌های حرفه‌ای آماده‌سازی قهوه',
                  duration: '۴ هفته',
                },
                {
                  icon: Award,
                  title: 'لته آرت',
                  description: 'هنر طراحی روی قهوه با شیر',
                  duration: '۶ هفته',
                },
                {
                  icon: Users,
                  title: 'چای‌شناسی',
                  description: 'آشنایی با انواع چای و روش‌های دم کردن',
                  duration: '۳ هفته',
                },
              ].map((course) => (
                <div key={course.title} className="card text-center">
                  <div className="w-16 h-16 bg-cafe-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <course.icon className="w-8 h-8 text-cafe-green" />
                  </div>
                  <h3 className="text-xl font-bold text-cafe-charcoal mb-2">{course.title}</h3>
                  <p className="text-cafe-charcoal-light mb-4">{course.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-cafe-charcoal-light">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              ))}
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

import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">ایجاد حساب کاربری</h2>
          <p className="mt-2 text-gray-600">به خانواده کافه مارگارت بپیوندید</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600">صفحه ثبت نام در حال توسعه است...</p>
        </div>
      </div>
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

export default SignUp;
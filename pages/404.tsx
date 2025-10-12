import React from 'react';
import { NextPageContext } from 'next';

function Custom404() {
  return (
    <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cafe-green mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <a
          href="/"
          className="btn-primary"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default Custom404;


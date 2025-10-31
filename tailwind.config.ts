import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cafe: {
          // Modern café palette with better contrast
          green: '#1a4d1a',          // Rich dark green (better contrast)
          'green-dark': '#0d2e0d',  // Deeper green
          'green-light': '#2d7a2d',  // Lighter green
          light: '#f8f6f4',          // Very light beige
          cream: '#ffffff',          // Pure white background
          brown: '#8b6914',          // Warm brown
          'brown-light': '#a68b2a',  // Light brown
          amber: '#c97706',          // Rich amber
          'amber-light': '#e5a02e',  // Light amber
          beige: '#f5f3f0',         // Clean beige
          'beige-dark': '#e8e5e0',   // Darker beige
          // New modern colors
          charcoal: '#2c2c2c',       // Dark text
          'charcoal-light': '#4a4a4a', // Medium text
          surface: '#ffffff',        // White surface
          'surface-light': '#fafafa', // Light surface
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        persian: ['Vazir', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'steam': 'steam 4s ease-in-out infinite',
        'coffee-shine': 'coffeeShine 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        steam: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-15px) scale(1.1)', opacity: '1' },
        },
        coffeeShine: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'cafe': '0 4px 14px 0 rgba(45, 80, 30, 0.15)',
        'cafe-lg': '0 10px 30px 0 rgba(45, 80, 30, 0.2)',
        'cafe-xl': '0 20px 50px 0 rgba(45, 80, 30, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config


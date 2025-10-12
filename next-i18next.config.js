module.exports = {
  i18n: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    localeDetection: false,
  },
  fallbackLng: {
    default: ['fa'],
    en: ['fa']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}

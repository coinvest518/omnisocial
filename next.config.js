
const { i18n } = require('./next-i18next.config');

const path = require('path');

module.exports = {
  i18n,
  async rewrites() {
    return [
      {
        source: '/:locale(en|es)',
        destination: '/?lng=$1',
      },
    ];
  },
  env: {
    SHOW_DONATE: process.env.SHOW_DONATE,
    SHOW_TWEET: process.env.SHOW_TWEET,
    SITE_URL: process.env.SITE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    domains: ['sdbooth2-production.s3.amazonaws.com'],
  },
  webpack: (config) => {


    config.module.rules.push({
      test: /\.html$/,
      use: ['html-loader'], // This ensures Webpack processes .html files correctly
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
    };
    return config;
  },
};

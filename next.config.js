const { i18n } = require('./next-i18next.config');
const path = require('path');
const resolve = require('path').resolve; // Import resolve from path


module.exports = { // Use CommonJS export
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
      use: ['html-loader'],
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname),
      '@components': resolve(__dirname, 'components'),
    };
    return config;
  },
};


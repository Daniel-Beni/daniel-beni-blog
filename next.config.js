/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

// Pas de path : le plugin utilise par défaut i18n/request.ts à la racine
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'https', hostname: 'localhost', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ENLEVÉ experimental.optimizeCss qui cause l'erreur critters
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Redirections
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fr',
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
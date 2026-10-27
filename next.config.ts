import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  // ==========================================
  // REACT CONFIGURATION
  // ==========================================

  // Enable React Strict Mode
  reactStrictMode: true,

  // ==========================================
  // SECURITY
  // ==========================================

  // Hide X-Powered-By: Next.js response header
  poweredByHeader: false,

  // ==========================================
  // PERFORMANCE
  // ==========================================

  // Enable response compression
  compress: true,

  // ==========================================
  // HTTP SECURITY HEADERS
  // ==========================================

  async headers() {
    return [
      {
        source: '/:path*',

        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

};

export default nextConfig;
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
        // todas las llamadas /api/* van al backend Spring Boot
      },
    ];
  },
};

module.exports = nextConfig;

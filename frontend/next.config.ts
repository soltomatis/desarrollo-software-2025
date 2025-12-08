// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {

    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` ,
        // todas las llamadas /api/* van al backend Spring Boot
      },
    ];
  },
};

module.exports = nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*", 
        // todas las llamadas /api/* van al backend Spring Boot
      },
    ];
  },
};

module.exports = nextConfig;

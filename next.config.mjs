/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR enabled - removed static export for better SEO
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a1laparoscopyhospital.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.a1laparoscopyhospital.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
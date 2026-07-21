/** @type {import('next').NextConfig} */

// 10. Bundle Analyzer Configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    reactStrictMode: true,
    compress: true, // Enable GZIP/Brotli compression
    // SSR enabled - removed static export for better SEO
    trailingSlash: true,
    // Turbopack configuration (Next.js 16 default)
    turbopack: {},
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
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/**',
            },
        ],
        // unoptimized removed - SSR supports image optimization
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'a1laparoscopyhospital.com',
                    },
                ],
                destination: 'https://www.a1laparoscopyhospital.com/:path*',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap.xml',
            },
        ]
    },

    // Optimization for bundle size
    experimental: {
        optimizePackageImports: ['@mui/material', '@mui/icons-material', 'react-icons', 'react-bootstrap'],
    },
    productionBrowserSourceMaps: false,
}

module.exports = withBundleAnalyzer(nextConfig);


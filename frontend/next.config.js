const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
    turbopack: {
        resolveAlias: {
            '@backend': path.join(__dirname, '/backend/src'),
        },
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ];
    },
    env: {
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
    async headers() {
        return [
            {
                source: '/api/voice-webhook',
                headers: [
                    { key: 'Content-Type', value: 'text/xml' },
                ],
            },
        ]
    },
    serverActions: {
        bodySizeLimit: '2mb'
    },
    transpilePackages: ['@backend','backend']
}

module.exports = nextConfig

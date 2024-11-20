const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'images.unsplash.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Add backend as external module
        if (isServer) {
            config.externals = [...config.externals, 
                'dotenv',
                '@vapi-ai/server-sdk',
                'twilio'
            ]
        }
        
        // Add backend path alias
        config.resolve.alias = {
            ...config.resolve.alias,
            '@backend': path.join(__dirname, '../backend/src')
        }
        return config
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
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb'
        }
    },
    transpilePackages: ['@backend'],
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb'
        },
        // Add this to handle external packages
        externalDir: true,
        outputFileTracingRoot: path.join(__dirname, '../')
    }
}

module.exports = nextConfig
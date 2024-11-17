const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
    // Add path aliases
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@backend': path.join(__dirname, '../backend/src')
        }
        return config
    }
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'dist',
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            net: false,
            tls: false,
            'pino-pretty': false
        };

        return config;
    },
};

module.exports = nextConfig;

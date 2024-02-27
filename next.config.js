/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'dist',
    webpack: (config, options) => {
        config.resolve.fallback = {
            fs: false,
            net: false,
            tls: false
        };

        return config;
    },
};

module.exports = nextConfig;

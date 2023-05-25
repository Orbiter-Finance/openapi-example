module.exports = {
    devServer: {
        open: true,
        host: '127.0.0.1',
        port: 8002,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095/',
                changeOrigin: true,
                pathRewrite: { '^/api': '/api' }
            },
        }
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = 'Orbiter balance';
            return args;
        });
    },
    css: {
        loaderOptions: {
            css: {},
            postcss: {
                plugins: [
                    require('postcss-px2rem')({
                        // 以设计稿750为例， 750 / 10 = 75
                        remUnit: 75
                    }),
                ]
            }
        }
    }
};

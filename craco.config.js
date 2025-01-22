const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                process: require.resolve("process/browser"),
                crypto: require.resolve("crypto-browserify"),
                buffer: require.resolve("buffer/"),
                stream: require.resolve("stream-browserify"),
                assert: false,
            };

            webpackConfig.plugins = [
                ...webpackConfig.plugins,
                new webpack.ProvidePlugin({
                  process: 'process/browser',
                  Buffer: ['buffer', 'Buffer']
                }),
              ];

            return webpackConfig;
        }
    }
};
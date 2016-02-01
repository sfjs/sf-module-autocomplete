var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');

var BANNER =
    'Autocomplete module v.'+pkg.version+'\n' +
    'https://github.com/sfjs/sf-module-autocomplete/\n' +
    'Copyright (c) 2016, Alex Chepura, Yauheni Yasinau, Maxim Matveev, spiralscout.com';

var bannerPlugin = new webpack.BannerPlugin(BANNER);
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    include: /\.min\.js$/,
    minimize: true,
    compress: {
        warnings: false
    }
});

module.exports = {
    entry: {
        "sf.autocomplete": './src/index.js',  // webpack workaround issue #300
        "sf.autocomplete.min": './src/index.js'  // webpack workaround issue #300
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '..', 'resources/scripts/spiral/')
    },
    resolve: {
        alias: {
            'sf': path.resolve(__dirname, '..', 'node_modules/sf/src/sf')
        },
        extensions: ['', '.js']
    },
    resolveLoader: {
        root: path.resolve(__dirname, '..', 'node_modules')
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel?presets[]=es2015&plugins[]=transform-runtime',
                exclude: /node_modules/
            }
        ],
        noParse: []
    },
    devtool: 'source-map',
    plugins: [bannerPlugin, uglifyJsPlugin],
    externals: {
        "sf": "sf"
    }
};

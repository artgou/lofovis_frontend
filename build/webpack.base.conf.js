var path = require('path');
var utils = require('./utils');
var config = require('../config');
var webpack = require('webpack');
const FlexiblePlugin = require('rnjs-webpack-plugin-flexible');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var baseConfig;

const plugins = [
  new webpack.ProvidePlugin({
    // $: 'jquery',
  }),
];
if (config.isPx2rem) {
  plugins.push(new FlexiblePlugin(config.FLEXIBLE_OPTIONS));
}

module.exports = function (config0) {
  baseConfig = config0;
  return {
    entry: utils.getEntry(
      `src/${baseConfig.build.viewSrcDirectory}/**/*.js`,
      `src/${baseConfig.build.viewSrcDirectory}/`
    ),
    output: {
      path: baseConfig.build.assetsRoot,
      filename: '[name].js',
      //  保持与webpack-dev-server的publicPath一致为 '/'
      publicPath:
        process.env.NODE_ENV === 'production'
          ? baseConfig.build.assetsPublicPath
          : baseConfig.dev.assetsPublicPath,
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': resolve('src/'),
      },
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src')],
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[ext]?[hash:10]'),
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[ext]?[hash:10]'),
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[ext]?[hash:10]'),
          },
        },
      ],
    },
  };
};

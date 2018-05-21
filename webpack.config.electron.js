import path from 'path';
import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';

export default {
  ...baseConfig,

  module: {
    ...baseConfig.module,

    loaders: [
      ...baseConfig.module.loaders,

      {
        test: /^realm/,
        loaders: ['babel-loader'],
      },
    ],
  },

  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,

  entry: [
    'babel-polyfill',
    './src/app/main/index',
  ],

  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'index.js',
  },

  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        warnings: false,
      },
    }),
    new webpack.BannerPlugin(
      process.env.NODE_ENV === 'development' ? 'require("source-map-support").install();' : '',
      {raw: true, entryOnly: false},
    ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [
    ...baseConfig.externals,
    'source-map-support',
  ],
};

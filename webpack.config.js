const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const SRC_DIR = path.join(__dirname, '/src');
const DIST_DIR = path.join(__dirname, '/public');

module.exports = {
  mode: 'production',
  context: SRC_DIR,
  entry: ['@babel/polyfill', './index.jsx'],
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,

  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CompressionPlugin({
      deleteOriginalAssets: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
        resolve: {
          extensions: ['*', '.js', '.jsx', '.css'],
        },
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|jpe?g|gif)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  watch: true,
};

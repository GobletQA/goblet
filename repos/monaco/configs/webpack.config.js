// @ts-nocheck
/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const hq = require('alias-hq')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootDir = path.resolve(__dirname, '..') 

module.exports = {
  entry: {
    app: path.resolve(rootDir, './demo/index.ts'),
  },
  output: {
    globalObject: 'self',
    path: path.join(rootDir, 'build'),
    filename: '[name].bundle.js',
  },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|ttf)$/,
        use: ['file-loader'],
      },
      {
      test: /\.m?js/,
      resolve: {
          fullySpecified: false
      }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(rootDir, 'demo', 'index.html'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      ASSETS_PATH: JSON.stringify('/'),
    })
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    },
    modules: ['demo', 'src', 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: hq.get('webpack')
  },
}

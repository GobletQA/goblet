// @ts-nocheck
/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const { ASSETS_PATH } = process.env
const rootDir = path.resolve(__dirname, '..') 

module.exports = {
  entry: {
    app: path.resolve(rootDir, './src/index.ts'),
  },
  output: {
    path: path.join(rootDir, 'build'),
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
  },
  mode: 'production',
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
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      ASSETS_PATH: JSON.stringify(ASSETS_PATH || '/'),
    }),
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    },
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@constants': path.resolve(rootDir, './src/constants'),
      '@components': path.resolve(rootDir, './src/components'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(rootDir, './src/utils'),
    },
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
}

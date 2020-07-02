const path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/main.js',
  output: {
    filename: 'neanderthals-vr.js',
    path: path.resolve(__dirname, 'assets/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};


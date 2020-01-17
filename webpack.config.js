const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'neanderthals-vr.js',
    path: path.resolve(__dirname, 'dist'),
  }
};

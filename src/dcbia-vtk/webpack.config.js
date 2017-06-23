var path = require('path');
var webpack = require('webpack');
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.v2.rules;
var entry = path.join(__dirname, './src/dcbia-vtk.directive.js');
const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, './dist');
module.exports = {
  entry,
  output: {
    path: outputPath,
    filename: 'dcbia-vtk.directive.js',
  },
  module: {
    rules: [
        { test: entry, loader: "expose-loader?dcbia-vtk.directive" },
        { test: /\.html$/, loader: 'html-loader' },
    ].concat(vtkRules),
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },
};
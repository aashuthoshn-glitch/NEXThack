const path = require('path')

module.exports = {
  entry: {
    'dashboardtalk-dashboard': path.join(__dirname, 'src', 'dashboard.js')
  },
  output: {
    path: path.resolve(__dirname, 'js'),
    publicPath: '/js/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devtool: 'source-map'
}

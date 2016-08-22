var webpack = require('webpack')
var path = require('path');

var srcPath = path.join(__dirname, 'src');

module.exports = {
  entry: {
    index:['./src/main.js']
  },
  output: {
    path: '/static/',
    publicPath: '/static/',
    filename: 'build.js'
  },
  resolve: {
    alias: {
          moxie: path.join(__dirname, 'plupload/js/moxie.js'),
          'plupload': path.join(__dirname, 'plupload/js/plupload.dev.js')
    },
    root: srcPath,
    extensions: ['', '.js', '.css'],
    modulesDirectories: ['node_modules','plupload', srcPath]
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\/|plupload/,
        loader: 'babel'
      },
      { test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8190'
      },
      {
        test: /plupload\/js\/moxie\.js/,
        loader: 'exports?this.mOxie'
      }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [
    new webpack.ProvidePlugin({
          mOxie: 'moxie'
    })
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}

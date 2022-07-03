// Helper for combining webpack config objects
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = (config, context) => {
  return merge(config, {
    // deleteOutputPath: false,
    externalsPresets: {
      node: true,
    },
    entry: {
      // home: { import: './contact.js', filename: 'pages/[name][ext]' },
      shared: ['src/plugins/*.js', 'src/repository/*.js', 'src/rest/*.js'],
    },
    module: {
      rules: [],
    },
    resolve: {
      mainFiles: ['index'],
    },
    performance: {
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      },
    },
    output: {
      path: path.join(config.output.path, '.'),
      libraryTarget: 'commonjs',
      filename: '[name].js',
      pathinfo: true,
      chunkFilename: '[name].js',
      clean: {
        keep (asset) {
          return asset.includes('ignored/dir')
        },
      },
    },
    optimization: {
      minimize: false,
      concatenateModules: false,
    },
    externals: nodeExternals({
      importType: 'commonjs',
    }),
  })
}

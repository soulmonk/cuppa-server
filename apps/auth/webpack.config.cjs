const nodeExternals = require('webpack-node-externals')

// save it here "cwd": "apps/fastify-app",
// "cwd": "apps/fastify-app",
module.exports = (config, context) => {
  return {
    ...config,
    externalsPresets: {
      node: true,
    },
    plugins: [],
    output: {
      ...config.output,
      module: true,
      libraryTarget: 'module',
      chunkFormat: 'module',
      library: {
        type: 'module',
      },
      environment: {
        module: true,
      },
    },
    experiments: {
      outputModule: true,
    },
    externals: nodeExternals({
      importType: 'module',
    }),
  }
}

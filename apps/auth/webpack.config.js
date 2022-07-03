// import nodeExternals from 'webpack-node-externals'

export default (config, context) => {
  return {
    ...config,
    externalsPresets: {
      node: true,
    },
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
    // externals: nodeExternals({
    //   importType: 'module',
    // }),
  }
}

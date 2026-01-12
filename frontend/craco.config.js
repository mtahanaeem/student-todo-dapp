module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings from web3 and other node_modules
      webpackConfig.ignoreWarnings = [
        {
          module: /node_modules\/web3/,
          message: /Failed to parse source map/,
        },
      ];
      return webpackConfig;
    },
  },
};

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      try {
        const oneOfRule = webpackConfig.module.rules.find((r) => r.oneOf).oneOf;
        oneOfRule.forEach((rule) => {
          if (rule.use) {
            const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
            uses.forEach((u) => {
              if (u.loader && u.loader.includes('source-map-loader')) {
                rule.exclude = /node_modules\/web3/;
              }
            });
          }
        });
      } catch (e) {
        // If the shape is unexpected, don't break the build — return original config
        return webpackConfig;
      }
      return webpackConfig;
    }
  }
};

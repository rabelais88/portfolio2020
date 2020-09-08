const path = require('path');

module.exports = {
  addons: [
    '@storybook/preset-typescript',
    // {
    //   name: '@storybook/preset-typescript',
    //   options: {
    //     tsLoaderOptions: {
    //       configFile: path.resolve(__dirname, '../tsconfig.json'),
    //     },
    //     tsDocgenLoaderOptions: {
    //       tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
    //     },
    //     forkTsCheckerWebpackPluginOptions: {
    //       colors: false, // disables built-in colors in logger messages
    //     },
    //     include: [path.resolve(__dirname, '../src')],
    //   },
    // },
  ],
  // https://storybook.js.org/docs/react/configure/webpack
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    
    // absolute path support
    config.resolve.modules.push(path.resolve(__dirname, '../'));
    return config;
  },
};

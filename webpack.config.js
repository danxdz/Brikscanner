const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it
  // This helps with CodeSandbox compatibility
  if (config.mode === 'development') {
    config.devServer = {
      ...config.devServer,
      compress: true,
      disableHostCheck: true,
    };
  }
  
  return config;
};
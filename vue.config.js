const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // port:'3000',
    proxy: {
      '/starpapi': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/starpapi': '' },
      },
    },
  },
});

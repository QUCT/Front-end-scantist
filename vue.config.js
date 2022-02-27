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
        pathRewrite: { '/starpapi': '' },
      },
    },
    // 下边这个， 如果你是本地自己mock 的话用after这个属性，线上环境一定要干掉
    // after: require("./mock/mock-server.js")
  },
});

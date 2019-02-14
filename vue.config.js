const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/CRM/WeChat/App/" : "/",
  assetsDir:  "static",
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('prefetch')

    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  },
  configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
    Object.assign(config, { // 开发生产共同配置
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': path.resolve(__dirname, './src'),
          'src': path.resolve(__dirname, './src'),
          'assets': path.resolve(__dirname, './src/assets'),
          'components': path.resolve(__dirname, './src/components'),
          'static': path.resolve(__dirname, './static')
        }
      }
    })
  },
  devServer: {
    open: true, // 启动服务后是否打开浏览器
    host: 'localhost',
    port: 8888, // 服务端口
    https: false,
    hotOnly: true,
    proxy: {
      '/appactivity':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
      '/couponSys':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
      '/CRM':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
      '/mall29':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
      '/topapp':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
      '/paycenter':{
        target: "https://ceshi.lechengclub.com",
        changeOrigin: true,
      },
    }, 
  },
}
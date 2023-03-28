module.exports = {
  publicPath:
    process.env.NODE_ENV !== 'production'
      ? `/test-${process.env.VUE_SECOND_HOST}/`
      : `/${process.env.VUE_SECOND_HOST}/`,
  outputDir:
    process.env.NODE_ENV !== 'production'
      ? `test-${process.env.VUE_SECOND_HOST}`
      : process.env.VUE_SECOND_HOST,
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    https: process.env.VUE_APP_PROTOCOL === 'https',
    port: 3000,
    proxy: {
      '/df': {
        target: process.env.VUE_APP_PROXY_URL,
        ws: false,
        changeOrigin: true
      },
      '/df_test': {
        target: process.env.VUE_APP_PROXY_URL,
        ws: false,
        changeOrigin: true
      },
      '/api': {
        target: process.env.VUE_APP_PROXY_URL,
        ws: false,
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '好球后台'
      return args
    })
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.devtool('')
    } else {
      // 为开发环境修改配置...
    }
  }
}

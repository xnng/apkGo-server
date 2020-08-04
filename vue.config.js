const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isOpenReport = process.env.OPEN_REPORT

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'apkGo'
        return args
      })

    if (isOpenReport) {
      config.plugin('webpack-bundle-analyzer').use(new BundleAnalyzerPlugin())
    }
  }
}

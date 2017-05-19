// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/admin/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8090,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://192.168.0.104:8070/admin',
        target: 'http://119.23.78.31/admin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        onProxyReq(proxyReq, req, res) {
          if (req.method == 'POST' && req.body && req.headers['content-type']) {
            if (!req.headers['content-type'].startsWith('multipart/form-data')) {
              var body = req.body
              body = Object.keys(body).map(function(key) {
                  return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
              }).join('&')
              proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
              proxyReq.setHeader('content-length', body.length)
              proxyReq.setHeader('Accept', 'application/json')
              proxyReq.write(body)
              proxyReq.end()
            }
          }
        },
        onProxyRes(proxyRes, req, res) {
          if (proxyRes.headers['set-cookie'] instanceof Array && proxyRes.headers['set-cookie'].length > 0) {
            // 取出 JAVA SESSION 更改 PATH
            // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/admin/; HttpOnly' ]
            // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/; HttpOnly' ]
            var [ session, value ] = proxyRes.headers['set-cookie'][0].split(';')[0].split('=')
            proxyRes.headers['set-cookie'] = [`${session}=${value}; Path=/; HttpOnly`]
          }
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

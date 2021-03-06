// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

// flexible参数
const FLEXIBLE_OPTIONS = {
  maxWidth: 1200, // 页面最大宽度, 0表示宽度用100%自适应
  size: 750, // 美术页面宽度(px)
  remUnit: 75, // 1rem === ?px 网页根元素的字体大小
  ignore: [new RegExp('m1.*')], // 忽略页面，支持正则和字串 ['prod-detail.html', /prod-.*/]
  flexibleJSUrl: '/static/libs/flexible.js', // flexible.js文件(也可以用别的文件把flexible.js包起来)
};
// FTP参数
const FTP_OPTIONS = {
  host: '192.168.0.241',
  port: '21',
  user: 'xxx',
  password: 'xxxx',
  keepalive: 1000,
  // secure: true
};
// 后端项目相对目录(tools.js使用)
const BACKEND_PATH = '../lofovis/';
// 默认模块目录
const DEFAULT_MODULE = 'm';
// 开发环境下的资源和接口代理
const PROXY_TARGET = 'http://localhost:18003';
const PROXY_PATHS = ['/libs', '/static', '/upload', '/api/', `/${DEFAULT_MODULE}/`];
const PROXY_TABLE = {};
PROXY_PATHS.map((key) => {
  PROXY_TABLE[key] = {
    target: PROXY_TARGET,
    // secure: false,       // 如果是https接口，需要配置这个参数
    changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
    pathRewrite: {
      ['^' + key]: key,
    },
  };
});

module.exports = {
  FTP_OPTIONS,
  FLEXIBLE_OPTIONS,
  DEFAULT_MODULE,
  BACKEND_PATH,
  isPx2rem: true,

  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    //配置项目打包路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    viewSrcDirectory: DEFAULT_MODULE,
    viewDistDirectory: 'static/' + DEFAULT_MODULE,
    //配置资源文件路径
    assetsDirectory: 'static/' + DEFAULT_MODULE,
    //配置资源文件在项目中的引用
    assetsPublicPath: '/',
    productionSourceMap: false,
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
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    autoOpenBrowser: false,
    assetsDirectory: 'staticDev',
    assetsPublicPath: '/',
    proxyTable: PROXY_TABLE,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
};

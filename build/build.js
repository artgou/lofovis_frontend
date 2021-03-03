process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var getWebpackConfig = require('./webpack.prod.conf')
const utils = require('./utils')

const argArr = process.argv.slice(2);

var spinner = ora('building for production...')
spinner.start()

function onPackFinish (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  console.log(chalk.yellow('  Build complete.\n'))
}

let dirList = argArr.length > 0 ? argArr : utils.getSrcDirNameList()
for (let dirName of dirList) {
  let assetsDirName = `static/${dirName}`;
  let distDir = path.resolve(config.build.assetsRoot, assetsDirName)
  rm(distDir, async function (err) {
    if (err) {
      console.log(err)
      return
    }
    // 支持全目录及单目录打包
    // npm run build m/view 或 m/view/202004 或 m 或 m/202004
    // npm run build m/view/202004
    config.build.viewSrcDirectory = dirName;
    config.build.viewDistDirectory = assetsDirName;
    config.build.assetsDirectory = assetsDirName.split('/').slice(0, 2).join('/');  // static/m
    config.build.assetsPage = assetsDirName.replace(config.build.assetsDirectory, '');  // static/m/home 之home
    let webpackConfig = getWebpackConfig(config)
    await webpack(webpackConfig, onPackFinish);
  })
}

var fs = require('fs');
var path = require('path');
var rnjsHelper = require('rnjs-helper');
// var shell = require('child_process');
var rm = require('rimraf');
var package = require('../package.json');

// 执行命令
function doShell(cmd, callback, onSuccess) {
  return new Promise((resolve, reject) => {
    console.log(`\n执行命令: ${cmd}`);
    if (!callback) {
      callback = function (err, stdout, stderr) {
        if (err) {
          console.error('Error:: ' + err);
          reject(err);
        } else {
          console.error('√ ' + stdout);
          if (typeof onSuccess === 'function') {
            onSuccess(stdout);
          }
          resolve(stdout);
        }
      };
    }
    shell.exec(cmd, callback);
  });
}

// 拷贝资源
function copyFiles(projName, distName) {
  console.log('开始拷贝...', projName, distName);
  var srcDir = path.resolve(__dirname, `../dist/static/${distName}`);
  var distDir = path.resolve(__dirname, `../../${projName}/www/static/${distName}`);
  rm(distDir, async function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('拷贝资源：', srcDir, distDir);
    // doShell(`rm -rf ${distDir}`)
    // doShell(`cp -rf ${srcDir} ${distDir}`)

    rnjsHelper.copyDir(srcDir, distDir);
  });
}

copyFiles(package.name.replace('_frontend', ''), 'web');

var fs = require('fs')
var path = require('path')
var shell = require('child_process');
const ftp = require("basic-ftp")

const config = require('../config')

// 命令行参数
const argvArr = process.argv.slice(2);

// 暂停
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 执行命令
function doShell (cmd, callback, onSuccess) {
  return new Promise((resolve, reject) => {
    console.log(`\n执行命令: ${cmd}`);
    if (!callback) {
      callback = function (err, stdout, stderr) {
        if (err) {
          console.error('Error:: ' + err);
          reject(err)
        } else {
          console.error('√ ' + stdout);
          if (typeof onSuccess === 'function') {
            onSuccess(stdout)
          }
          resolve(stdout)
        }
      }
    }
    shell.exec(cmd, callback);
  })
}

function isExist (dir) {
  dir = path.normalize(dir);
  try {
    fs.accessSync(dir, fs.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function mkdir (dir, mode) {
  if (isExist(dir)) {
    if (mode) return chmod(dir, mode);
    return true;
  }
  const pp = path.dirname(dir);
  if (isExist(pp)) {
    try {
      fs.mkdirSync(dir, mode);
      return true;
    } catch (e) {
      return false;
    }
  }
  if (mkdir(pp, mode)) return mkdir(dir, mode);
  return false;
}

function chmod (p, mode) {
  try {
    fs.chmodSync(p, mode);
    return true;
  } catch (e) {
    return false;
  }
}

// 修正热更新bug
function fixHotMiddleware () {
  let filePath = path.resolve(__dirname, '../node_modules/webpack-hot-middleware/middleware.js');
  console.log('开始修正 webpack-hot-middleware ...' + filePath);
  let body = fs.readFileSync(filePath, 'utf-8');
  body = body.replace('if (!res.finished) res.end();', 'if (!res.finished && res.end) res.end();');
  fs.writeFileSync(filePath, body);
  console.log('修正成功');
}

// 拷贝dist相关目录或文件
async function copyDistTo (copyPathArr) {
  let rootDir = path.resolve(__dirname, '../');
  let staticDir = path.resolve(config.BACKEND_PATH, 'www/static')
  for (let i = 0; i < copyPathArr.length; i++) {
    let fromPath = path.resolve('./dist/static', copyPathArr[i]);
    let toPath = path.resolve(staticDir, copyPathArr[i]);
    if (!isExist(fromPath)) {
      console.log('拷贝失败，源目录不存在：' + fromPath)
      continue
    }
    mkdir(toPath)
    await doShell(`cd ${rootDir} && rm -rf ${toPath} && cp -rf ${fromPath} ${toPath}`)
  }
}

// 上传dist相关目录或文件到远程服务器
async function uploadDistTo (pathArr) {
  for (let i = 0; i < pathArr.length; i++) {
    let fromPath = path.resolve('./dist/static', pathArr[i]);
    if (!isExist(fromPath)) {
      console.log('上传失败，源目录不存在：' + fromPath)
      continue
    }
    // 这里一定要以/开头，否则自动创建目录会不及时或出错
    let remotePath = ('/static/' + pathArr[i]).replace(/\/\//g, '/')
    var stat = fs.lstatSync(fromPath);
    if (stat.isDirectory()) {
      await uploadDir(fromPath, remotePath)
    } else {
      await uploadFile(fromPath, remotePath)
    }
  }
}

// 执行FTP操作
async function doFtp (callback) {
  const client = new ftp.Client()
  client.ftp.verbose = true
  try {
    await client.access(config.FTP_OPTIONS)
    await callback(client)
  } catch (err) {
    console.log('\n' + err)
  }
  client.close()
}

/**
 * 上传本地目录到远程
 * @param localDirPath
 * @param remoteDirPath
 * @param isRemoveRemoteDir        是否先移除远程目录(全覆盖) 默认true, false时只是把本的文件上传(远程容易有垃圾冗余)
 * @return {Promise<void>}
 */
async function uploadDir (localDirPath, remoteDirPath, isRemoveRemoteDir = true) {
  return doFtp(async (client) => {
    if (isRemoveRemoteDir === true) {
      try {
        await client.removeDir(remoteDirPath)
      } catch (e) {
        // 可能不存在，所以删除失败
      }
    }
    await client.uploadFromDir(localDirPath, remoteDirPath)
  })
}

/**
 * 上传本地文件到远程
 * @param localFilePath
 * @param remoteFilePath
 * @param isAutoCreateDir
 * @return {Promise<void>}
 */
async function uploadFile (localFilePath, remoteFilePath, isAutoCreateDir = true) {
  return doFtp(async (client) => {
    if (isAutoCreateDir) {
      const dirPath = path.dirname(remoteFilePath);
      await client.ensureDir(dirPath)
    }
    await client.uploadFrom(localFilePath, remoteFilePath)
  })
}

// 执行npm指令
let action = argvArr.shift()
if (action === 'fixhot') {
  fixHotMiddleware()
} else if (action === 'copy') {
  copyDistTo(argvArr)
} else if (action === 'ftp') {
  uploadDistTo(argvArr)
}

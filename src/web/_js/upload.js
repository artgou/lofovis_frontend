const { Ajax } = require('./tools');

function readerFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      function () {
        resolve(reader.result);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });
}

export function initUploader(max) {
  const uploadDom = $('#upload');
  uploadDom.on('change', (event) => {
    let files = event.target.files;
    if (!files.length) {
      return null;
    }
    event.target.files = null;
    const count = $('.upload-item').length - 1; // 有一个是+
    const last = files.length + count > max ? max - count : files.length + count;
    if (files.length + count >= max) {
      uploadDom.hide();
    }
    for (let i = 0; i < last; i++) {
      const file = files[i];
      readerFile(file).then((e) => {
        let dom = document.createElement('div');
        dom.className = 'upload-item';
        dom.innerHTML = '<img src=' + e + '><div class="del"><i class="icon icon-del"></i></div>';
        dom.file = file;
        uploadDom.before(dom);
        $('.upload-list .del').on('click', function (e) {
          $(this).parent().remove();
          uploadDom.show();
        });
      });
    }
  });
}

export function getFileList() {
  let fileList = [];
  let list = $('.upload-item').filter((index, item) => item.className.indexOf('upload-file') === -1);
  for (let i = 0; i < list.length; i++) {
    fileList.push(list[i].file);
  }
  return fileList;
}

/**
 * 上传文件到七牛
 * @param {*} folder
 * @param {*} fileList
 */
export async function uploadToQiniu(folder, fileList) {
  const loadingIndex = layer.load(1);
  const pathList = [];
  if (fileList && fileList.length) {
    for (const file of fileList) {
      const { path } = await uploadFileToQiniu(folder, file);
      pathList.push(path);
    }
  }
  layer.close(loadingIndex);
  return pathList;
}

async function uploadFileToQiniu(folder, file, callback) {
  return new Promise((resolve, reject) => {
    const tokenParams = {
      folder,
      name: file.name,
      temp: 0,
    };
    Ajax('POST', '/web/upload/token', tokenParams, (ret) => {
      const msg = '云存token获取失败';
      if (!ret || ret.errno !== 0) {
        layer.msg(msg);
        return;
      }
      const tokenRet = ret.data;
      if (!tokenRet || !tokenRet.token) {
        layer.msg(msg);
        throw new Error(msg);
      }
      const data = {
        key: tokenRet.key,
        token: tokenRet.token,
        file: file, // 七牛必须是file
      };
      const url = tokenRet.zone || 'http://upload.qiniup.com';
      const qiniuDomain = tokenRet.domain;
      const qiniuDomainKey = tokenRet.domain_key;
      const options = {
        withCredentials: false, // 七牛必须为false
      };
      const formData = new FormData();
      Object.keys(data).map((key) => formData.append(key, data[key]));
      function onLoadSuccess(res) {
        const url = qiniuDomain + res.key;
        const path = qiniuDomainKey + res.key;
        resolve({ url, path, key: res.key });
      }
      function onLoadFail(res) {
        reject();
      }
      Ajax('POST', url, formData, onLoadSuccess, onLoadFail, options);
    });
  });
}

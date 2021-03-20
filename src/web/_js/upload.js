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

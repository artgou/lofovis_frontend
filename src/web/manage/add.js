require('../_js/common');
require('./add.less');
const { initUploader, getFileList } = require('../_js/upload');

$(function () {
  initUploader(7);

  //提交
  function submit() {
    const fileList = getFileList();
    console.log({ fileList });
  }

  $('#btnSubmit').on('click', submit);
});
